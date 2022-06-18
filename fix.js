const FIX_crash_issue_ENUM = {
    'size': 'font-size',
    'fontName': 'font-family',
    'fontWeight': 'font-weight',
    'fontStyle': 'font-style',
};

const FIX_inital_images = () => {
    const images = [...document.querySelectorAll("img")].filter((element) => {
        return !!FIX_is_image_target(element);
    })

    images.forEach(element => FIX_image_to_text(element))
}

const FIX_is_image_target = (element) => {
    const src = element.getAttribute("src");
    if (src.includes("/render/text")) {
        return {
            element,
            src
        };
    }
    return false;
}

const FIX_image_to_text = (element) => {
    const query_params = element.src.split("?")[1].split("&");
    const element_width = element.clientWidth;
    const element_height = element.clientHeight;

    let leftovers = [];
    let styleObject = [];
    let text = "";

    query_params.forEach((param) => {
        const [property, value] = param.split("=");

        if (property === 'text') {
            text = decodeURI(value);
            return;
        }

        if (FIX_crash_issue_ENUM[property]) {
            styleObject[FIX_crash_issue_ENUM[property]] = decodeURI(value);
        } else {
            leftovers[property] = value;
        }
    })

    const color = `rgba(${leftovers['colorRed']},${leftovers['colorGreen']},${leftovers['colorBlue']},${leftovers['colorAlpha']})`;
    styleObject['color'] = color;
    styleObject['width'] = element_width + "px";
    styleObject['height'] = element_height + "px";

    if (styleObject['font-weight'] == "light") {
        styleObject['font-weight'] = 400;
    }

    const styles = Object.entries(styleObject).map(([property, value]) => {
        return property + ":" + value;
    }).join(";");

    const span = document.createElement("span");
    span.innerText = text;
    span.style = styles;
    element.parentNode.insertBefore(span, element.nextSibling);
    element.remove();
}


FIX_inital_images();