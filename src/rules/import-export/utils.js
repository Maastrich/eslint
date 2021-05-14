/* istanbul ignore file */

function presetIndex(input, patterns) {
  for (let i = 0; i < patterns.length; ++i) {
    if (patterns[i].test(input)) {
      return i;
    }
  }
  return Infinity;
}

exports.regexSort = function regexSort(list, patterns) {
  let importGroups = {};

  list.forEach((c) => {
    importGroups[presetIndex(c, patterns)] = [
      ...(importGroups[presetIndex(c, patterns)] || []),
      c,
    ];
  });

  const importGroupsArr = Object.keys(importGroups).map((groupKey) => {
    let group = importGroups[groupKey];
    return {
      index: groupKey,
      group: group.sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
      ),
    };
  });
  importGroupsArr.sort((a, b) =>
    a.index < b.index ? -1 : a.index > b.index ? 1 : 0
  );
  const sorted = [];

  importGroupsArr
    .map((importPath) => importPath.group)
    .forEach((group) => sorted.push(...group));

  return sorted;
};

exports.arrayEquals = function arrayEquals(source, compare) {
  return (
    Array.isArray(source) &&
    Array.isArray(compare) &&
    source.length === compare.length &&
    source.every((val, index) => val === compare[index])
  );
};
