package com.lcs.findraco.support;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import com.lcs.findraco.user.model.User;
import jakarta.servlet.http.Cookie;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Objects;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UriUtils;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

/**
 * Drives the authorization server as Claude and the user's browser do: authorize, sign in, consent, exchange the code,
 * refresh. The client is the test client pinned in {@code src/test/resources/oauth/cimd/}; the PKCE pair is RFC
 * 7636's example.
 */
public final class OAuthClientFlow {

    public static final String CLIENT_ID = "http://127.0.0.1:1/oauth/test-client";
    public static final String REDIRECT_URI = "https://client.example/callback";
    public static final String RESOURCE = "http://localhost/mcp";
    public static final String SCOPE = "findraco.mcp";
    public static final String STATE = "client-state";
    public static final String CODE_VERIFIER = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
    public static final String CODE_CHALLENGE = "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM";

    private static final JsonMapper JSON = JsonMapper.builder().build();

    private final MockMvc mockMvc;

    public OAuthClientFlow(MockMvc mockMvc) {
        this.mockMvc = mockMvc;
    }

    /** The parameters of the authorization request Claude opens in the browser. */
    public static MultiValueMap<String, String> authorizeParams() {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("response_type", "code");
        params.add("client_id", CLIENT_ID);
        params.add("redirect_uri", REDIRECT_URI);
        params.add("scope", SCOPE);
        params.add("state", STATE);
        params.add("code_challenge", CODE_CHALLENGE);
        params.add("code_challenge_method", "S256");
        params.add("resource", RESOURCE);
        return params;
    }

    public static MockHttpServletRequestBuilder authorizeRequest(MultiValueMap<String, String> params) {
        return get("/oauth2/authorize").queryParams(params);
    }

    public static MockHttpServletRequestBuilder authorizeRequest() {
        return authorizeRequest(authorizeParams());
    }

    /** Opens the authorization request anonymously, then posts the sign-in form; the session is signed in. */
    public MockHttpSession signIn(User user) throws Exception {
        MvcResult redirectToLogin = mockMvc.perform(authorizeRequest()).andReturn();
        // The session the anonymous request opened holds the saved authorization request.
        MockHttpSession session = (MockHttpSession)
                Objects.requireNonNull(redirectToLogin.getRequest().getSession(false), "the sign-in session");
        Cookie csrf = Objects.requireNonNull(redirectToLogin.getResponse().getCookie("XSRF-TOKEN"), "the CSRF cookie");
        mockMvc.perform(post("/oauth2/login")
                .session(session)
                .cookie(csrf)
                .param("email", user.getEmail())
                .param("password", "password")
                .param("_csrf", csrf.getValue()));
        return session;
    }

    /** The {@code state} the consent page posts back, from the redirect to it. */
    public String consentState(MockHttpSession session) throws Exception {
        String consent = mockMvc.perform(authorizeRequest().session(session))
                .andReturn()
                .getResponse()
                .getRedirectedUrl();
        return queryParam(Objects.requireNonNull(consent, "the redirect to the consent page"), "state");
    }

    /** The consent form's post, as the consent page sends it for "Allow" or "Deny". */
    public ResultActions decide(MockHttpSession session, String state, String action) throws Exception {
        return mockMvc.perform(post("/oauth2/authorize")
                .session(session)
                .param("client_id", CLIENT_ID)
                .param("state", state)
                .param("scope", SCOPE)
                .param("consent_action", action));
    }

    /** A code issued to the client after the user signs in and allows. */
    public String code(User user) throws Exception {
        MockHttpSession session = signIn(user);
        String callback = decide(session, consentState(session), "allow")
                .andReturn()
                .getResponse()
                .getRedirectedUrl();
        return queryParam(Objects.requireNonNull(callback, "the redirect to the client"), "code");
    }

    public ResultActions exchange(String code) throws Exception {
        return mockMvc.perform(post("/oauth2/token")
                .param("grant_type", "authorization_code")
                .param("code", code)
                .param("redirect_uri", REDIRECT_URI)
                .param("client_id", CLIENT_ID)
                .param("code_verifier", CODE_VERIFIER)
                .param("resource", RESOURCE));
    }

    public ResultActions refresh(String refreshToken, String clientId) throws Exception {
        return mockMvc.perform(post("/oauth2/token")
                .param("grant_type", "refresh_token")
                .param("refresh_token", refreshToken)
                .param("client_id", clientId)
                .param("resource", RESOURCE));
    }

    /** The token response of a full connection: sign in, allow, exchange. */
    public JsonNode connect(User user) throws Exception {
        return json(exchange(code(user)));
    }

    public static JsonNode json(ResultActions result) throws Exception {
        return JSON.readTree(result.andReturn().getResponse().getContentAsString());
    }

    /** The claims of a JWT, read without checking its signature. */
    public static JsonNode claims(String jwt) {
        int start = jwt.indexOf('.') + 1;
        String payload = jwt.substring(start, jwt.indexOf('.', start));
        return JSON.readTree(new String(Base64.getUrlDecoder().decode(payload), StandardCharsets.UTF_8));
    }

    /** A query parameter of a redirect, decoded as the browser decodes it. */
    public static String queryParam(String url, String name) {
        String value =
                UriComponentsBuilder.fromUriString(url).build().getQueryParams().getFirst(name);
        return UriUtils.decode(Objects.requireNonNull(value, name), StandardCharsets.UTF_8);
    }
}
