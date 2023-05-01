import keyboardKeys from './data.js';


const Keyboard = {
    elements: {
        desctiption: null,
        title: null,
        textarea: null,
        main: null,
        keysContainer: null,
        keys: []
    },

    properties: {
        capsLock: false,
        shift: 'text',
        lang: localStorage.getItem('lang') || 'en'
    },

    init() {
        //Создание элементов в объекте elements
        this.elements.title = document.createElement('h1')
        this.elements.textarea = document.createElement('textarea')
        this.elements.desctiption = document.createElement('span')
        this.elements.main = document.createElement('div')
        this.elements.keysContainer = document.createElement('div')

        //Добавление классов для новых элементов
        this.elements.title.classList.add('title')
        this.elements.textarea.classList.add('entry-field')
        this.elements.desctiption.classList.add('desctiption')
        this.elements.main.classList.add('keyboard')
        this.elements.keysContainer.classList.add('keyboard__keys')

        //Добавление атрибутов и контента
        this.elements.textarea.setAttribute('autofocus', '')
        this.elements.title.textContent = 'Virtual Keyboard'
        this.elements.desctiption.textContent =
            `
            * Для переключения языка Ctrl-Shift
            * Клавиатура для системы Windows
            `
        //Добавление кнопок клавиатуры в объект keysContainer
        this.elements.keysContainer.appendChild(this._createKeys())

        //Добавление элементов кнопок в массив keys
        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key')

        //Добавление элементов в DOM
        this.elements.main.appendChild(this.elements.keysContainer)

        document.body.appendChild(this.elements.title)
        document.body.appendChild(this.elements.textarea)
        document.body.appendChild(this.elements.desctiption)
        document.body.appendChild(this.elements.main)
    },

    _createKeys() {
        const fragment = document.createDocumentFragment()
        const keyLayout = keyboardKeys

        //Эффект нажатия с физической клавиатуры на виртуальной
        document.addEventListener('keydown', function(event) {
            const textarea = document.querySelector('.entry-field')

            //Установка фокуса в конце строки на поле ввода при нажатии клавиши
            textarea.focus()
            textarea.selectionStart = textarea.value.length

            let key = document.querySelector(`[data-keycode='${event.code}']`)
            key.classList.add('keyboard__key--opacity')
        })

        document.addEventListener('keyup', function(event) {
            let key = document.querySelector(`[data-keycode='${event.code}']`)
            key.classList.remove('keyboard__key--opacity')
        })

        //Создание HTML для иконок
        const createIconHTML = (iconName) => {
            return `<span class="icon icon--${iconName}"></span>`
        }

        //Создание контейнера для стрелок up-down
        const arrowContainer = document.createElement('div')
        arrowContainer.classList.add('arrow-container')

        //Создание кнопок с обработчиками
        keyLayout.forEach(item => {
            const key = item[this.properties.lang][this.properties.shift] //Путь со значением кнопки
            const keyElement = document.createElement('button')
            const insertLineBreak = ['Backspace', 'Delelte', 'Enter', 'ShiftRight'].indexOf(item.id) !== -1

            keyElement.setAttribute('type', 'button')
            keyElement.classList.add('keyboard__key')
            keyElement.dataset.keycode = item.id  //прописываем в dataset keycode клавиши

            switch (key) {
                case 'Backspace':
                    keyElement.classList.add('keyboard__key--wide')
                    keyElement.innerHTML = createIconHTML('backspace')

                    keyElement.addEventListener('click', () => {
                        let textarea = document.querySelector('.entry-field')
                        textarea.value = textarea.value.slice(0, textarea.value.length - 1)
                    })
                    break

                case 'CapsLock':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable')
                    keyElement.innerHTML = createIconHTML('capslk')

                    if (this.properties.capsLock) {
                        keyElement.classList.toggle('keyboard__key--active')
                    }

                    keyElement.addEventListener('click', () => {
                        this._toggleCapsLock()
                        keyElement.classList.toggle('keyboard__key--active')
                    })
                    break

                case 'Enter':
                    keyElement.classList.add('keyboard__key--wide')
                    keyElement.innerHTML = createIconHTML('enter')

                    keyElement.addEventListener('click', () => {
                        let textarea = document.querySelector('.entry-field')
                        textarea.value += '\n'
                    })
                    break

                case 'Space':
                    keyElement.classList.add('keyboard__key--extra-wide')
                    keyElement.innerHTML = createIconHTML('space')

                    keyElement.addEventListener('click', () => {
                        let textarea = document.querySelector('.entry-field')
                        textarea.value += ' '
                    })
                    break

                case 'Shift':
                    keyElement.classList.add('keyboard__key--wide')
                    keyElement.textContent = key
                    break

                case 'Tab':
                    keyElement.textContent = key
                    keyElement.addEventListener('click', () => {
                        let textarea = document.querySelector('.entry-field')
                        textarea.value += '    '
                    })
                    break

                case 'Del':
                    keyElement.textContent = key
                    keyElement.addEventListener('click', () => {
                        let textarea = document.querySelector('.entry-field')
                        textarea.value = textarea.value.slice(0, textarea.value.length - 1)
                    })
                    break

                case 'Ctrl':
                    keyElement.textContent = key
                    break

                case 'Win':
                    keyElement.textContent = key
                    break

                case 'Alt':
                    keyElement.textContent = key
                    break

                case '▲':
                    keyElement.classList.add('keyboard__key--small')
                    keyElement.textContent = key
                    keyElement.style.width = '90%'
                    keyElement.addEventListener('click', () => {
                        let textarea = document.querySelector('.entry-field')
                        textarea.value += '▲'
                    })
                    arrowContainer.appendChild(keyElement)
                    break

                case '▼':
                    keyElement.classList.add('keyboard__key--small')

                    keyElement.textContent = key
                    keyElement.style.width = '90%'
                    keyElement.addEventListener('click', () => {
                        let textarea = document.querySelector('.entry-field')
                        textarea.value += '▼'
                    })
                    arrowContainer.appendChild(keyElement)
                    fragment.appendChild(arrowContainer)
                    break

                default:
                    keyElement.textContent = key

                    keyElement.addEventListener('click', () => {
                        let textarea = document.querySelector('.entry-field')
                        textarea.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase()
                    })
                    break
            }

            if (key !== '▲' && key !== '▼') {
                fragment.appendChild(keyElement)
            }

            if (insertLineBreak) {
                fragment.appendChild(document.createElement('br'))
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
    },

    _toggleLang() {
        Keyboard.properties.lang === 'ru' ? Keyboard.properties.lang = 'en' : Keyboard.properties.lang = 'ru'
        window.localStorage.setItem('lang', Keyboard.properties.lang)
    },

    _toggleShift() {
        Keyboard.properties.shift === 'text' ? Keyboard.properties.shift = 'textShift' : Keyboard.properties.shift = 'text'
    }
}


window.addEventListener('DOMContentLoaded', function () {
    Keyboard.init()
})


//CapsLock по нажатию физической клавиатуры
document.addEventListener('keydown', function(event) {
    if (event.code === 'CapsLock') {
        Keyboard._toggleCapsLock()
        document.querySelector('[data-keycode=CapsLock').classList.toggle('keyboard__key--active')
    }
})


//Переключение языка
let pressed = new Set()

document.addEventListener('keydown', function(event) {
    pressed.add(event.code)
    if (Array.from(pressed).includes('ShiftLeft') && Array.from(pressed).includes('ControlLeft')) {
        Keyboard._toggleLang()
        const keys = document.querySelector('.keyboard__keys')
        keys.innerHTML = ''
        keys.appendChild(Keyboard._createKeys())
        Keyboard.elements.keys = Keyboard.elements.keysContainer.querySelectorAll('.keyboard__key')
    }

    setTimeout(function() {
        pressed.clear()
    }, 500)
})


//shift
document.addEventListener('keydown', function(event) {
    if (event.code === 'ShiftLeft' && !event.repeat) {
        Keyboard._toggleShift()
        const keys = document.querySelector('.keyboard__keys')
        keys.innerHTML = ''
        keys.appendChild(Keyboard._createKeys())
        Keyboard.elements.keys = Keyboard.elements.keysContainer.querySelectorAll('.keyboard__key')
    }
})

document.addEventListener('keyup', function(event) {
    if (event.code === 'ShiftLeft') {
        Keyboard._toggleShift()
        const keys = document.querySelector('.keyboard__keys')
        keys.innerHTML = ''
        keys.appendChild(Keyboard._createKeys())
        Keyboard.elements.keys = Keyboard.elements.keysContainer.querySelectorAll('.keyboard__key')
    }
})
