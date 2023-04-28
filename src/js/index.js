const Keyboard = {
    elements: {
        title: null,
        textarea: null,
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false,
    },

    init() {
         //Создание элементов в объекте elements
         this.elements.title = document.createElement("h1")
         this.elements.textarea = document.createElement("textarea")
         this.elements.main = document.createElement("div")
         this.elements.keysContainer = document.createElement("div")

         //Добавление классов для новых элементов
         this.elements.title.classList.add("title")
         this.elements.title.textContent = "Virtual Keyboard"
         this.elements.textarea.classList.add("entry-field")

         this.elements.main.classList.add("keyboard", "keyboard--hidden")
         this.elements.keysContainer.classList.add("keyboard__keys")
         this.elements.keysContainer.appendChild(this._createKeys())

         this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key")

         //Добавление элементов в DOM
         this.elements.main.appendChild(this.elements.keysContainer)
         document.body.appendChild(this.elements.title)
         document.body.appendChild(this.elements.textarea)
         document.body.appendChild(this.elements.main)

         //Подключаем ввод на textarea
         document.querySelectorAll(".entry-field ").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue
                })
            })
         })
    },

    _createKeys() {
        const fragment = document.createDocumentFragment()
        const keyLayout = [
            "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
            "Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\", "Del",
            "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter",
            "Done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift",
            "Ctrl", "Win", "Alt", "Space", "Alt", "Ctrl", "◀", "up-down", "▶"
        ]

        //Создание HTML для иконок
        const createIconHTML = (iconName) => {
            return `<span class="icon icon--${iconName}"></span>`
        }

        keyLayout.forEach(key => {


            const keyElement = document.createElement("button")
            const insertLineBreak = ["Backspace", "Del", "Enter", "Shift"].indexOf(key) !== -1


            keyElement.setAttribute("type", "button")
            keyElement.classList.add("keyboard__key")

            switch (key) {
                case "Backspace":
                    keyElement.classList.add("keyboard__key--wide")
                    keyElement.innerHTML = createIconHTML("backspace")

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1)
                        this._triggerEvent("oninput")
                    })

                    break

                case "CapsLock":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable")
                    keyElement.innerHTML = createIconHTML("capslk")

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock()
                        keyElement.classList.toggle("keyboard__key--active")
                    })

                    break

                case "Enter":
                    keyElement.classList.add("keyboard__key--wide")
                    keyElement.innerHTML = createIconHTML("enter")

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n"
                        this._triggerEvent("oninput")
                    })

                    break

                case "Space":
                    keyElement.classList.add("keyboard__key--extra-wide")
                    keyElement.innerHTML = createIconHTML("space")

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " "
                        this._triggerEvent("oninput")
                    })

                    break

                case "Done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark")
                    keyElement.innerHTML = createIconHTML("done")

                    keyElement.addEventListener("click", () => {
                        this.close()
                        this._triggerEvent("oninput")
                    })

                    break

                case "Shift":
                    keyElement.classList.add("keyboard__key--wide")
                    keyElement.textContent = key

                    break

                case "Tab":
                    keyElement.textContent = key
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "    "
                        this._triggerEvent("oninput")
                    })

                    break

                default:
                    keyElement.textContent = key

                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase()
                        this._triggerEvent("oninput")
                    })

                    break
            }

            if (key === "up-down") {

                //создаем элемент-контейнер для стрелок
                const arrowContainer = document.createElement("div")
                arrowContainer.classList.add("arrow-container")

                //создаем кнопку стрелку вниз
                let keyElement = document.createElement("button")
                keyElement.setAttribute("type", "button")
                keyElement.classList.add("keyboard__key", "keyboard__key--small")
                keyElement.innerText = "▲"
                keyElement.style.width = "90%"
                keyElement.addEventListener("click", () => {
                    this.properties.value += "▲"
                    this._triggerEvent("oninput")
                })
                arrowContainer.appendChild(keyElement)


                //создаем кнопку стрелку вверх
                keyElement = document.createElement("button")
                keyElement.setAttribute("type", "button")
                keyElement.classList.add("keyboard__key", "keyboard__key--small")
                keyElement.innerText = "▼"
                keyElement.style.width = "90%"
                keyElement.addEventListener("click", () => {
                    this.properties.value += "▼"
                    this._triggerEvent("oninput")
                })
                arrowContainer.appendChild(keyElement)

                //добавляем во фрагмент элемент-котейнер для стрелок
                fragment.appendChild(arrowContainer)
            }

            if (key !== "up-down") {
                fragment.appendChild(keyElement)
            }

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"))
            }
        })
        return fragment
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value)
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0 && key.textContent.length === 1) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase()
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || ""
        this.eventHandlers.oninput = oninput
        this.eventHandlers.onclose = onclose
        this.elements.main.classList.remove("keyboard--hidden")
    },

    close() {
        this.properties.value = ""
        this.eventHandlers.oninput = oninput
        this.eventHandlers.onclose = onclose
        this.elements.main.classList.add("keyboard--hidden")
    }
}


window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init()
})
