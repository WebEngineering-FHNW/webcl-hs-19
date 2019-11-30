
export { dom }

const dom = innerString => {
    const div = document.createElement("DIV");
    div.innerHTML = innerString;
    return div.firstChild;
};
