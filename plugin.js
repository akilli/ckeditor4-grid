'use strict';

(function (CKEDITOR) {
    /**
     * Plugin
     */
    CKEDITOR.plugins.add('grid', {
        requires: 'widget',
        icons: 'grid',
        hidpi: true,
        lang: 'de,en',
        init: function (editor) {
            /**
             * Widget
             */
            editor.widgets.add('grid', {
                button: editor.lang.grid.title,
                template: '<div class="grid"><div class="content"></div></div>',
                editables: {
                    content: {
                        selector: '.content'
                    }
                },
                allowedContent: {
                    div: {
                        classes: {content: true, grid: true}
                    }
                },
                requiredContent: 'div(grid)',
                upcast: function (el) {
                    if (el.name !== 'div' || !el.hasClass('grid')) {
                        return false;
                    }

                    var content = new CKEDITOR.htmlParser.element('div', {'class': 'content'});
                    el.add(content, 0);
                    content.children = el.children.slice(1);
                    el.children = el.children.slice(0, 1);

                    if (content.children.length < 1 || content.children[content.children.length - 1].name !== 'p') {
                        content.add(new CKEDITOR.htmlParser.element('p'));
                    }

                    return el;
                },
                downcast: function (el) {
                    var dom = this.editables.content.$;
                    Array.prototype.forEach.call(dom.children, function (item) {
                        var name = getWidgetName(item);

                        if (!name || name === 'grid') {
                            item.parentElement.removeChild(item);
                        }
                    });
                    el.children[0].setHtml(this.editables.content.getData());
                    el.children[0].children.forEach(function (item) {
                        if (item.name !== 'p') {
                            el.add(item);
                        }
                    });
                    el.children[0].remove();

                    if (dom.children.length < 1 || dom.lastElementChild.tagName.toLowerCase() !== 'p') {
                        var p = dom.ownerDocument.createElement('p');
                        p.appendChild(dom.ownerDocument.createElement('br'));
                        dom.appendChild(p);
                    }

                    return el.children.length > 0 ? el : new CKEDITOR.htmlParser.text('');
                }
            });

            /**
             * Styles
             */
            editor.addContentsCss(this.path + 'styles/grid.css');
        }
    });

    /**
     * Returns the widget name if given element is a widget element or wrapper or null otherwise
     *
     * @param {HTMLElement} el
     *
     * @return {String|null}
     */
    function getWidgetName(el) {
        if (!(el instanceof HTMLElement)) {
            return null;
        }

        if (el.hasAttribute('data-widget')) {
            return el.getAttribute('data-widget') || null;
        }

        if (el.tagName.toLowerCase() === 'div' && el.hasAttribute('data-cke-widget-wrapper') && el.firstElementChild instanceof HTMLElement) {
            return el.firstElementChild.getAttribute('data-widget') || null;
        }

        return null;
    }
})(CKEDITOR);
