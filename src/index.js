/**
 * Build styles
 */
import { IconH1, IconH2, IconH3, IconH4, IconH5, IconH6, IconHeading } from '@codexteam/icons'

require('./index.css').toString()

/**
 * @typedef {object} HeaderData
 * @description Tool's input and output data format
 * @property {string} text — Header's content
 * @property {number} level - Header's level from 1 to 6
 * @property {string} anchor - Header's anchor
 */

/**
 * @typedef {object} HeaderConfig
 * @description Tool's config from Editor
 * @property {string} placeholder — Block's placeholder
 * @property {number[]} levels — Heading levels
 * @property {number} defaultLevel — Default level
 * @property {boolean} allowAnchor — Enable anchor block output
 * @property {number} anchorLength — Anchor's length
 */

/**
 * Header block for the Editor.js.
 *
 * @license MIT
 */
class Header {
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: HeaderData, config: HeaderConfig, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   *   readOnly - read only mode flag
   */
  constructor ({ data, config, api, readOnly }) {
    this.api = api
    this.readOnly = readOnly

    /**
     * Styles
     *
     * @type {object}
     */
    this._CSS = {
      block: this.api.styles.block,
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
      wrapper: 'ce-header',
      settingsWrapper: 'cdx-settings-wrapper',
      settingsItemsWrapper: 'cdx-settings-items-wrapper',
      settingsItem: 'cdx-settings-item',
      settingsInput: 'cdx-settings-input',
      blockAfterHide: 'after-hide'
    }

    /**
     * Tool's settings passed from Editor
     *
     * @type {HeaderConfig}
     * @private
     */
    this._settings = config

    this._settings.allowAnchor = ('allowAnchor' in this._settings)
      ? !!this._settings.allowAnchor
      : Header.DEFAULT_ENABLE_ANCHOR

    if (this._settings.allowAnchor) {
      this._settings.anchorLength = parseInt(this._settings.anchorLength) ||
        Header.DEFAULT_ANCHOR_LENGTH
    }

    /**
     * Block's data
     *
     * @type {HeaderData}
     * @private
     */
    this._data = this.normalizeData(data)

    /**
     * List of settings buttons
     *
     * @type {HTMLElement[]}
     */
    this.settingsButtons = []

    /**
     * Main Block wrapper
     *
     * @type {HTMLElement}
     * @private
     */
    this._element = this.getTag()

    /**
     * Hide pseudo-element ::after to not show an empty anchor's value near with
     * the header block.
     */
    if ('anchor' in this._data && !this._data.anchor.length) {
      this._element.classList.add(this._CSS.blockAfterHide)
    }
  }

  /**
   * Normalize input data
   *
   * @param {HeaderData} data - saved data to process
   *
   * @returns {HeaderData}
   * @private
   */
  normalizeData (data) {
    const newData = {}

    if (typeof data !== 'object') {
      data = {}
    }

    newData.text = data.text || ''
    newData.level = parseInt(data.level) || this.defaultLevel.number
    newData.anchor = this._settings.allowAnchor ? (data.anchor || '') : ''

    return newData
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLHeadingElement}
   * @public
   */
  render () {
    return this._element
  }

  /**
   * Create Block's settings block
   *
   * @returns {HTMLElement}
   */
  renderSettings () {
    const holder = document.createElement('DIV')
    holder.classList.add(this._CSS.settingsWrapper)

    // add holder for selectors
    const tagsHolder = document.createElement('DIV')
    tagsHolder.classList.add(this._CSS.settingsItemsWrapper)
    holder.appendChild(tagsHolder)

    /**
     * Add anchor input if available
     */
    if (this._settings.allowAnchor) {
      const settingsItemAnchor = document.createElement('DIV')
      settingsItemAnchor.classList.add(this._CSS.settingsItem)
      settingsItemAnchor.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 984.899 984.899"><path d="M884.75 779.899l46.1 14.301c24.899 7.699 48.899-14.4 43.1-39.9l-48.7-215.1c-5.8-25.4-36.899-35.101-56.1-17.4l-161.9 149.8c-19.2 17.7-12 49.5 13 57.3l42.2 13.1c-25.2 28.899-54.9 53.7-88.1 73.3-37.601 22.2-78.9 37.3-121.9 44.5V500.6h103.9c33.1 0 60-26.899 60-60 0-33.1-26.9-60-60-60h-103.9v-49.5c64.8-24.4 111-86.9 111-160.1 0-94.3-76.7-171-171-171s-171 76.7-171 171c0 73.2 46.2 135.8 111 160.1v49.5h-103.9c-33.1 0-60 26.9-60 60 0 33.101 26.9 60 60 60h103.9v359.2c-42.9-7.3-84.3-22.3-121.9-44.5-33.1-19.7-62.899-44.5-88.1-73.4l42.2-13.1c24.9-7.7 32.1-39.5 13-57.3l-161.9-149.7c-19.2-17.7-50.3-8-56.1 17.4l-48.7 215.199c-5.8 25.4 18.2 47.601 43.1 39.9l46.1-14.3c39.2 56.2 90.2 103.6 149.3 138.6 73.3 43.4 157.4 66.3 243 66.3s169.6-22.899 243-66.3c59.099-35.099 110.099-82.499 149.3-138.7zM543.45 170.9c0 7.8-1.8 15.2-4.9 21.9-8.199 17.2-25.8 29.1-46.1 29.1s-37.9-11.9-46.1-29.1c-3.2-6.6-4.9-14-4.9-21.9 0-28.1 22.9-51 51-51s51 22.9 51 51z"/></svg>'

      const anchorInput = document.createElement('INPUT')
      anchorInput.classList.add(this._CSS.settingsInput)
      anchorInput.placeholder = 'Anchor'
      anchorInput.value = this.anchor

      settingsItemAnchor.appendChild(anchorInput)

      /**
       * Append input to holder
       */
      holder.appendChild(settingsItemAnchor)

      /**
       * Add an event Listener to input field
       */
      anchorInput.addEventListener('input', (event) => {
        // Allow only the following characters
        let value = event.target.value.replace(/[^a-zа-я0-9_-]/gi, '')
        const valueLength = value.length

        // limit the length of the anchor
        if (valueLength > this._settings.anchorLength) {
          value = value.slice(0, this._settings.anchorLength)
        }

        // put the received value after filters in the input field
        event.target.value = value

        // put the value in the tag data
        this._element.dataset.anchor = value

        // save the value
        this.data.anchor = value

        if (valueLength > 0) {
          this._element.classList.contains(this._CSS.blockAfterHide)
            ? this._element.classList.remove(this._CSS.blockAfterHide)
            : this._element.classList.add(this._CSS.blockAfterHide)
        }
      })
    }

    // do not add settings button, when only one level is configured
    if (this.levels.length <= 1) {
      return holder
    }

    /** Add type selectors */
    this.levels.forEach(level => {
      const selectTypeButton = document.createElement('SPAN')

      selectTypeButton.classList.add(this._CSS.settingsButton)

      /**
       * Highlight current level button
       */
      if (this.currentLevel.number === level.number) {
        selectTypeButton.classList.add(this._CSS.settingsButtonActive)
      }

      /**
       * Add SVG icon
       */
      selectTypeButton.innerHTML = level.svg

      /**
       * Save level to its button
       */
      selectTypeButton.dataset.level = level.number

      /**
       * Set up click handler
       */
      selectTypeButton.addEventListener('click', () => {
        this.setLevel(level.number)
      })

      /**
       * Append settings button to holder
       */
      tagsHolder.appendChild(selectTypeButton)

      /**
       * Save settings buttons
       */
      this.settingsButtons.push(selectTypeButton)
    })

    return holder
  }

  /**
   * Callback for Block's settings buttons
   *
   * @param {number} level - level to set
   */
  setLevel (level) {
    this.data = {
      level,
      text: this.data.text,
      anchor: this._settings.allowAnchor ? this.data.anchor : ''
    }

    /**
     * Highlight button by selected level
     */
    this.settingsButtons.forEach(button => {
      button.classList.toggle(this._CSS.settingsButtonActive,
        parseInt(button.dataset.level) === level)
    })
  }

  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   *
   * @param {HeaderData} data - saved data to merger with current block
   * @public
   */
  merge (data) {
    const newData = {
      text: this.data.text + data.text,
      level: this.data.level,
      anchor: this._settings.allowAnchor ? this.data.anchor : ''
    }

    this.data = newData
  }

  /**
   * Validate Text block data:
   * - check for emptiness
   *
   * @param {HeaderData} blockData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate (blockData) {
    return blockData.text.trim() !== ''
  }

  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLHeadingElement} toolsContent - Text tools rendered view
   * @returns {HeaderData} - saved data
   * @public
   */
  save (toolsContent) {
    return {
      text: toolsContent.innerHTML,
      level: this.currentLevel.number,
      anchor: this._settings.allowAnchor ? this.anchor : ''
    }
  }

  /**
   * Allow Header to be converted to/from other blocks
   */
  static get conversionConfig () {
    return {
      export: 'text', // use 'text' property for other blocks
      import: 'text' // fill 'text' property from other block's export string
    }
  }

  /**
   * Sanitizer Rules
   */
  static get sanitize () {
    return {
      level: false,
      text: {},
      anchor: false
    }
  }

  /**
   * Returns true to notify core that read-only is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported () {
    return true
  }

  /**
   * Get default status for enabling anchor
   *
   * @public
   * @returns {boolean}
   */
  static get DEFAULT_ENABLE_ANCHOR () {
    return true
  }

  /**
   * Default length for anchor
   *
   * @public
   * @returns {Number}
   */
  static get DEFAULT_ANCHOR_LENGTH () {
    return 50
  }

  /**
   * Get current Tools`s data
   *
   * @returns {HeaderData} Current data
   * @private
   */
  get data () {
    this._data.text = this._element.innerHTML
    this._data.level = this.currentLevel.number

    return this._data
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {HeaderData} data — data to set
   * @private
   */
  set data (data) {
    this._data = this.normalizeData(data)

    /**
     * If level is set and block in DOM
     * then replace it to a new block
     */
    if (data.level !== undefined && this._element.parentNode) {
      /**
       * Create a new tag
       *
       * @type {HTMLHeadingElement}
       */
      const newHeader = this.getTag()

      /**
       * Save Block's content
       */
      newHeader.innerHTML = this._element.innerHTML

      /**
       * Replace blocks
       */
      this._element.parentNode.replaceChild(newHeader, this._element)

      /**
       * Save new block to private variable
       *
       * @type {HTMLHeadingElement}
       * @private
       */
      this._element = newHeader
    }

    /**
     * If data.text was passed then update block's content
     */
    if (data.text !== undefined) {
      this._element.innerHTML = this._data.text || ''
    }
  }

  /**
   * Get tag for target level
   * By default returns second-leveled header
   *
   * @returns {HTMLElement}
   */
  getTag () {
    /**
     * Create element for current Block's level
     */
    const tag = document.createElement(this.currentLevel.tag)

    /**
     * Add text to block
     */
    tag.innerHTML = this._data.text || ''

    /**
     * Add styles class
     */
    tag.classList.add(this._CSS.wrapper)

    /**
     * Make tag editable
     */
    tag.contentEditable = this.readOnly ? 'false' : 'true'

    /**
     * Add Placeholder
     */
    tag.dataset.placeholder = this.api.i18n.t(this._settings.placeholder || '')

    /**
     * Add anchor to if available
     */
    if (this._settings.allowAnchor === true) {
      tag.dataset.anchor = this.anchor
    }

    /**
     * Hide pseudo-element ::after to not show an empty anchor's value near with
     * the header block.
     */
    if ('anchor' in this._data && this._data.anchor.length === 0) {
      tag.classList.add(this._CSS.blockAfterHide)
    }

    return tag
  }

  /**
   * Get anchor
   *
   * @returns {String}
   */
  get anchor () {
    return this._data.anchor || ''
  }

  /**
   * Get current level
   *
   * @returns {level}
   */
  get currentLevel () {
    let level = this.levels.find(
      levelItem => levelItem.number === this._data.level)

    if (!level) {
      level = this.defaultLevel
    }

    return level
  }

  /**
   * Return default level
   *
   * @returns {level}
   */
  get defaultLevel () {
    /**
     * User can specify own default level value
     */
    if (this._settings.defaultLevel) {
      const userSpecified = this.levels.find(levelItem => {
        return levelItem.number === this._settings.defaultLevel
      })

      if (userSpecified) {
        return userSpecified
      } else {
        console.warn(
          '(ง\'̀-\'́)ง Heading Tool: the default level specified was not found in available levels')
      }
    }

    /**
     * With no additional options, there will be H2 by default
     *
     * @type {level}
     */
    return this.levels[1]
  }

  /**
   * @typedef {object} level
   * @property {number} number - level number
   * @property {string} tag - tag corresponds with level number
   * @property {string} svg - icon
   */

  /**
   * Available header levels
   *
   * @returns {level[]}
   */
  get levels () {
    const availableLevels = [
      {
        number: 1,
        tag: 'H1',
        svg: IconH1
      },
      {
        number: 2,
        tag: 'H2',
        svg: IconH2
      },
      {
        number: 3,
        tag: 'H3',
        svg: IconH3
      },
      {
        number: 4,
        tag: 'H4',
        svg: IconH4
      },
      {
        number: 5,
        tag: 'H5',
        svg: IconH5
      },
      {
        number: 6,
        tag: 'H6',
        svg: IconH6
      }
    ]

    return this._settings.levels
      ? availableLevels.filter(
        l => this._settings.levels.includes(l.number)
      )
      : availableLevels
  }

  /**
   * Handle H1-H6 tags on paste to substitute it with header Tool
   *
   * @param {PasteEvent} event - event with pasted content
   */
  onPaste (event) {
    const content = event.detail.data

    /**
     * Define default level value
     *
     * @type {number}
     */
    let level = this.defaultLevel.number

    switch (content.tagName) {
      case 'H1':
        level = 1
        break
      case 'H2':
        level = 2
        break
      case 'H3':
        level = 3
        break
      case 'H4':
        level = 4
        break
      case 'H5':
        level = 5
        break
      case 'H6':
        level = 6
        break
    }

    if (this._settings.levels) {
      // Fallback to nearest level when specified not available
      level = this._settings.levels.reduce((prevLevel, currLevel) => {
        return Math.abs(currLevel - level) < Math.abs(prevLevel - level)
          ? currLevel
          : prevLevel
      })
    }

    this.data = {
      level,
      text: content.innerHTML
    }
  }

  /**
   * Used by Editor.js paste handling API.
   * Provides configuration to handle H1-H6 tags.
   *
   * @returns {{handler: (function(HTMLElement): {text: string}), tags: string[]}}
   */
  static get pasteConfig () {
    return {
      tags: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']
    }
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox () {
    return {
      icon: IconHeading,
      title: 'Heading'
    }
  }
}

export default Header
