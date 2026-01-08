/**
 * Base interface for all queries
 * Queries represent read operations (data retrieval)
 * They should be named descriptively (e.g., GetUser, ListUsers)
 * @template TResult The type of data this query will return
 */
export interface IQuery<TResult = any> {
    // Marker interface - no required properties
    // The generic type is used to enforce type safety in query handlers
}
