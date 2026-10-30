package com.lcs.findraco.shared.error;

/**
 * An enum that accepts part of a wider one, so a request cannot carry a value the use case refuses. A
 * value outside it answers 422 {@code validation-failed} on its field: the value names something real
 * (a role, say), only not one this request accepts. Any other unknown enum value stays unreadable (400).
 */
public interface NarrowedEnum {}
