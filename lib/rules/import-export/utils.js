"use strict";
/* istanbul ignore file */
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
function presetIndex(input, patterns) {
    for (var i = 0; i < patterns.length; ++i) {
        if (patterns[i].test(input)) {
            return i;
        }
    }
    return Infinity;
}
exports.regexSort = function regexSort(list, patterns) {
    var importGroups = {};
    list.forEach(function (c) {
        importGroups[presetIndex(c, patterns)] = __spreadArray(__spreadArray([], (importGroups[presetIndex(c, patterns)] || [])), [
            c,
        ]);
    });
    var importGroupsArr = Object.keys(importGroups).map(function (groupKey) {
        var group = importGroups[groupKey];
        return {
            index: groupKey,
            group: group.sort(function (a, b) {
                return a.localeCompare(b, undefined, { sensitivity: "base" });
            })
        };
    });
    importGroupsArr.sort(function (a, b) {
        return a.index < b.index ? -1 : a.index > b.index ? 1 : 0;
    });
    var sorted = [];
    importGroupsArr
        .map(function (importPath) { return importPath.group; })
        .forEach(function (group) { return sorted.push.apply(sorted, group); });
    return sorted;
};
exports.arrayEquals = function arrayEquals(source, compare) {
    return (Array.isArray(source) &&
        Array.isArray(compare) &&
        source.length === compare.length &&
        source.every(function (val, index) { return val === compare[index]; }));
};
