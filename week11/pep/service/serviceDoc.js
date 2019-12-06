
import "../domainDoc.js"

/**
 * @callback onDevelopersReadyCallback
 * @param    {Developer[]} devs - array of developers
 * @return   {undefined} void
 */


/**
 * Common interface for all services (abstract factory pattern)
 *
 * @typedef {{loadDevelopers: (function(onDevelopersReadyCallback): undefined)}} PepService
 * */
