import Mock from 'mockjs'

export function formatDate(date) {
    return date.replace('-', '.').replace('-', '.');
}

export function splitDate(date) {
    let res = date.split('.');
    return [res[0] + '.' + res[1], res[2]];
}

export function limitString(str, limit) {
    if (limit >= str.length)
        return str;
    let res = "";
    for (let i = 0; i < limit; i++) {
        res += str[i];
    }
    res += "...";
    return res;
}

export function getUrlParam(url) {
    let params = url.split("?")[1];
    let pairs = params.split("&");
    let obj = {};
    for (let i = 0; i < pairs.length; i++) {
        let pair = pairs[i].split("=");
        obj[pair[0]] = pair[1];
    }
    return obj;
}

export const ran = Mock.Random;

export function ranDataImage(size, text) {
    return ran.dataImage(size, text);
}

export function ranTitle(min, max) {
    return ran.title(min, max);
}

export function ranSentence(min, max) {
    return ran.sentence(min, max);
}

export function ranParagraph(min, max) {
    return ran.paragraph(min, max);
}

export function ranName(middle) {
    return ran.name(middle);
}

export function ranCName() {
    return ran.cname();
}

export function ranInteger(min, max) {
    return ran.integer(min, max);
}

export function ranBoolean() {
    return ran.boolean();
}