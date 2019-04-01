/* named groups */
const date = `2019-04-01`;
const {year, month, day} = date.match(/(?<year>\d+)-(?<month>\d+)-(?<day>\d+)/).groups;
