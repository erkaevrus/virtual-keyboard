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

         this.elements.main.classList.add("keyboard", "1keyboard--hidden")
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

    },

    _triggerEvent(handlerName) {

    },

    _toggleCapsLock() {

    },

    open(initialValue, oninput, onclose) {

    },

    close() {

    }
}


window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init()
})
