/**
 * Access objects value if object is not undefined or null
 */
safeGet = function (object, key, optional){
    if(object)
        return object[key]
    return optional;
}