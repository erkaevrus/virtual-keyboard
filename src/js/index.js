import keyboardKeys from "./data.js";


const Keyboard = {
    elements: {
        title: null,
        textarea: null,
        main: null,
        keysContainer: null,
        keys: []
    },

    properties: {
        capsLock: false,
        lang: "en"
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

         this.elements.main.classList.add("keyboard")
         this.elements.keysContainer.classList.add("keyboard__keys")
         this.elements.keysContainer.appendChild(this._createKeys())

         this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key")

         //Добавление элементов в DOM
         this.elements.main.appendChild(this.elements.keysContainer)
         document.body.appendChild(this.elements.title)
         document.body.appendChild(this.elements.textarea)
         document.body.appendChild(this.elements.main)

    },

    _createKeys() {
        const fragment = document.createDocumentFragment()
        const keyLayout = keyboardKeys
        // [
        //     "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace",
        //     "Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\", "Del",
        //     "CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter",
        //     "Done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift",
        //     "Ctrl", "Win", "Alt", "Space", "Alt", "Ctrl", "◀", "up-down", "▶"
        // ]


        //Эффект нажатия с физической клавиатуры на виртуальной
        document.addEventListener('keydown', function(event) {
            let key = document.querySelector(`[data-keycode='${event.code}']`)
            key.classList.add("keyboard__key--opacity")
        })

        document.addEventListener('keyup', function(event) {
            let key = document.querySelector(`[data-keycode='${event.code}']`)
            key.classList.remove("keyboard__key--opacity")
        })


        //Создание HTML для иконок
        const createIconHTML = (iconName) => {
            return `<span class="icon icon--${iconName}"></span>`
        }
        //Контейнер для стрелок up-down
        const arrowContainer = document.createElement("div")
        arrowContainer.classList.add("arrow-container")

        keyLayout.forEach(item => {

            const key = item[this.properties.lang].text

            const keyElement = document.createElement("button")
            const insertLineBreak = ["Backspace", "Delelte", "Enter", "ShiftRight"].indexOf(item.id) !== -1


            keyElement.setAttribute("type", "button")
            keyElement.classList.add("keyboard__key")
            keyElement.dataset.keycode = item.id //прописываем в dataset keycode клавиши

            switch (key) {
                case "Backspace":
                    keyElement.classList.add("keyboard__key--wide")
                    keyElement.innerHTML = createIconHTML("backspace")

                    keyElement.addEventListener("click", () => {
                        let textarea = document.querySelector(".entry-field ")
                        textarea.value = textarea.value.slice(0, textarea.value.length - 1)
                    })

                    break

                case "CapsLock":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable")
                    keyElement.innerHTML = createIconHTML("capslk")

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock()
                        keyElement.classList.toggle("keyboard__key--active")
                    })

                    document.addEventListener('keydown', function(event) {
                        if (event.code === "CapsLock") {
                            Keyboard._toggleCapsLock()
                            keyElement.classList.toggle("keyboard__key--active")
                        }
                    })

                    break

                case "Enter":
                    keyElement.classList.add("keyboard__key--wide")
                    keyElement.innerHTML = createIconHTML("enter")

                    keyElement.addEventListener("click", () => {
                        let textarea = document.querySelector(".entry-field ")
                        textarea.value += "\n"
                    })

                    break

                case "Space":
                    keyElement.classList.add("keyboard__key--extra-wide")
                    keyElement.innerHTML = createIconHTML("space")

                    keyElement.addEventListener("click", () => {
                        let textarea = document.querySelector(".entry-field ")
                        textarea.value += " "
                    })

                    break

                case "Shift":
                    keyElement.classList.add("keyboard__key--wide")
                    keyElement.textContent = key

                    break

                case "Tab":
                    keyElement.textContent = key
                    keyElement.addEventListener("click", () => {
                        let textarea = document.querySelector(".entry-field ")
                        textarea.value += "    "
                    })

                    break

                case "Del":
                    keyElement.textContent = key
                    keyElement.addEventListener("click", () => {
                        let textarea = document.querySelector(".entry-field ")
                        textarea.value = textarea.value.slice(0, textarea.value.length - 1)
                    })

                    break

                case "Ctrl":
                    keyElement.textContent = key
                    break

                case "Win":
                    keyElement.textContent = key
                    break

                case "Alt":
                    keyElement.textContent = key
                    break

                case "▲":
                    keyElement.classList.add("keyboard__key--small")
                    keyElement.textContent = key
                    keyElement.style.width = "90%"
                    keyElement.addEventListener("click", () => {
                        let textarea = document.querySelector(".entry-field ")
                        textarea.value += "▲"
                    })

                    arrowContainer.appendChild(keyElement)
                    break

                case "▼":
                    keyElement.classList.add("keyboard__key--small")

                    keyElement.textContent = key
                    keyElement.style.width = "90%"
                    keyElement.addEventListener("click", () => {
                        let textarea = document.querySelector(".entry-field ")
                        textarea.value += "▼"
                    })

                    arrowContainer.appendChild(keyElement)
                    fragment.appendChild(arrowContainer)
                    break

                default:
                    keyElement.textContent = key

                    keyElement.addEventListener("click", () => {
                        let textarea = document.querySelector(".entry-field ")
                        textarea.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase()
                    })

                    break
            }

            if (key !== "▲" && key !== "▼") {
                fragment.appendChild(keyElement)
            }

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"))
            }
        })
        return fragment
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0 && key.textContent.length === 1) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase()
            }
        }
    }
}


window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init()
})
