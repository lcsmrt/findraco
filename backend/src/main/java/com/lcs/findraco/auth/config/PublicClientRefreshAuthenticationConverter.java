package com.lcs.findraco.auth.config;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import org.jspecify.annotations.Nullable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2ClientAuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationConverter;
import org.springframework.util.StringUtils;

/**
 * Reads a public client's refresh request: {@code grant_type=refresh_token} with a {@code client_id} and no secret.
 * Spring's {@code PublicClientAuthenticationConverter} matches only code exchanges carrying a {@code code_verifier},
 * so without this a public client could not refresh at all.
 */
final class PublicClientRefreshAuthenticationConverter implements AuthenticationConverter {

    @Override
    public @Nullable Authentication convert(HttpServletRequest request) {
        if (!HttpMethod.POST.matches(request.getMethod())
                || !AuthorizationGrantType.REFRESH_TOKEN
                        .getValue()
                        .equals(request.getParameter(OAuth2ParameterNames.GRANT_TYPE))
                || request.getHeader(HttpHeaders.AUTHORIZATION) != null
                || request.getParameter(OAuth2ParameterNames.CLIENT_SECRET) != null) {
            return null;
        }
        String[] clientIds = request.getParameterValues(OAuth2ParameterNames.CLIENT_ID);
        if (clientIds == null || clientIds.length != 1 || !StringUtils.hasText(clientIds[0])) {
            return null;
        }
        Map<String, Object> additionalParameters = new HashMap<>();
        additionalParameters.put(OAuth2ParameterNames.GRANT_TYPE, AuthorizationGrantType.REFRESH_TOKEN.getValue());
        return new OAuth2ClientAuthenticationToken(
                clientIds[0], ClientAuthenticationMethod.NONE, null, additionalParameters);
    }
}
