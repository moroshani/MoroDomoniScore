package com.morodomino.android.security

import org.json.JSONArray
import org.json.JSONObject

fun Any?.toJsonValue(): Any? = when (this) {
    null -> JSONObject.NULL
    is Map<*, *> -> {
        val obj = JSONObject()
        entries.forEach { (key, value) ->
            if (key != null) obj.put(key.toString(), value.toJsonValue())
        }
        obj
    }
    is List<*> -> {
        val array = JSONArray()
        forEach { item -> array.put(item.toJsonValue()) }
        array
    }
    is Number, is Boolean, is String -> this
    else -> this.toString()
}
