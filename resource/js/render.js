let hideNodeCache = [];

/**
 * 为DOM元素创建渐隐效果
 * @param element DOM元素
 * @param timeout 渐隐效果持续时间
 * @param needClearLater 是否需要清空元素中全部的其他DOM元素
 */
function fadeOut(element, timeout, needClearLater) {
    let opacityPercent = 100;
    element.style.transition = "opacity 1ms";

    let currentTime = Date.now();

    let rid = setInterval(function (){
        element.style.opacity = (opacityPercent / 100).toString();
        opacityPercent -= (100 / timeout) * (Date.now() - currentTime);

        if (opacityPercent < 0) {
            if(needClearLater){
                element.innerHTML = "";
            }

            this.hide(element);

            clearInterval(rid);
        }

        currentTime = Date.now();
    }, 1);
}

/**
 * 为DOM元素创建渐显效果
 * @param element DOM元素
 * @param timeout 渐显效果持续时间
 * @param displayType 恢复显示时，该DOM元素的display类型（默认为unset）
 */
function fadeIn(element, timeout, displayType) {
    element.style.transition = "opacity 1ms";
    element.style.opacity = "0";

    let opacityPercent = 0;

    if (displayType === undefined) {
        this.show(element);
    }
    else {
        element.style.display = displayType;
    }

    let currentTime = Date.now();

    let rid = setInterval(function (){
        element.style.opacity = (opacityPercent / 100).toString();
        opacityPercent += (100 / timeout) * (Date.now() - currentTime);

        if (opacityPercent > 100) {
            element.style.opacity = "";
            element.style.transition = "";
            clearInterval(rid);
        }

        currentTime = Date.now();
    }, 1);
}

/**
 * 即刻隐藏DOM元素
 * @param element DOM元素
 */
function hide(element) {
    hideNodeCache[element] = element.style.display;
    element.style.display = "none";
}

/**
 * 即刻恢复DOM元素的显示
 * @param element DOM元素
 */
function show(element){
    if(element in hideNodeCache){
        element.style.display = hideNodeCache[element];
    }
    else {
        element.style.display = "";
    }
}