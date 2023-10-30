class Modal {
    constructor(config) {
        this._type = config.type;
        this._text = config.text;
        this._button = config.button;
        this._button_callback = config.button_callback;
        this._sub_button = config.sub_button;
        this._sub_button_callback = config.sub_button_callback;
    }

    show() {
        let container = document.createElement("div");
        container.id = "modal-container";

        let background = document.createElement("div");
        background.classList.add("modal-background");

        let frame = document.createElement("div");
        frame.classList.add("modal-frame");

        let closeBtn = document.createElement("a");
        closeBtn.innerText = "×";
        closeBtn.addEventListener("click", () => {
            document.getElementById("modal-container").remove();
        });
        frame.appendChild(closeBtn);

        let modal = document.createElement("div");
        modal.classList.add("modal");

        let image = document.createElement("img");
        switch (this._type) {
            case "warning":
                image.src = "./img/warning.svg";
                break;
            case "error":
                image.src = "./img/error.svg";
                break;
            default:
                image.src = "./img/success.svg";
                break;
        }
        modal.appendChild(image);


        let text = document.createElement("p");
        text.innerText = this._text;
        modal.appendChild(text);

        let submitBtn = document.createElement("button");
        submitBtn.innerText = (this._button != null ? this._button : "确定");
        submitBtn.addEventListener("click", (this._button_callback === undefined ? () => {
            document.getElementById("modal-container").remove();
        } : this._button_callback))
        modal.appendChild(submitBtn);

        if (this._sub_button !== undefined) {
            let subBtn = document.createElement("button");
            subBtn.innerText = (this._sub_button != null ? this._sub_button : "取消");
            subBtn.addEventListener("click", (this._sub_button_callback === undefined ? () => {
                document.getElementById("modal-container").remove();
            } : this._sub_button_callback))
            modal.appendChild(subBtn);
        }

        frame.appendChild(modal);
        background.appendChild(frame);
        container.appendChild(background);

        container.style.display = "none";
        document.body.appendChild(container);

        fadeIn(container, 200);
    }
}