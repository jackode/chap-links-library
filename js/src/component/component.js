/**
 * Prototype for visual components
 */
function Component () {
    this.id = null;
    this.parent = null;
    this.controller = null;
    this.options = null;

    this.frame = null; // main DOM element
    this.top = 0;
    this.left = 0;
    this.width = 0;
    this.height = 0;
}

/**
 * Set parameters for the frame. Parameters will be merged in current parameter
 * set.
 * @param {Object} options  Available parameters:
 *                          {String} [id]
 *                          {String | function} [className]
 *                          {Component[]} [depends]   Components on which this
 *                                                    component depends on
 *                          {String | Number | function} [left]
 *                          {String | Number | function} [top]
 *                          {String | Number | function} [width]
 *                          {String | Number | function} [height]
 */
Component.prototype.setOptions = function(options) {
    var me = this;
    if (options) {
        util.forEach(options, function (value, key) {
            switch (key) {
                case 'id':
                    // id can be set only once
                    if (me.id == null) {
                        me.id = value;
                    }
                    break;

                case 'depends':
                    me.depends = value;
                    break;

                case 'parent':
                    me.parent = value;
                    break;

                default:
                    me.options[key] = value;
                    break;
            }
        });
    }

    if (this.controller) {
        this.requestRepaint();
        this.requestReflow();
    }
};

/**
 * Get the container element of the component, which can be used by a child to
 * add its own widgets. Not all components do have a container for childs, in
 * that case null is returned.
 * @returns {HTMLElement | null} container
 */
Component.prototype.getContainer = function () {
    // should be implemented by the component
    return null;
};

/**
 * Repaint the component
 * @return {Boolean} changed
 */
Component.prototype.repaint = function () {
    // should be implemented by the component
    return false;
};

/**
 * Reflow the component
 * @return {Boolean} resized
 */
Component.prototype.reflow = function () {
    // should be implemented by the component
    return false;
};

/**
 * Request a repaint. The controller will schedule a repaint
 */
Component.prototype.requestRepaint = function () {
    if (this.controller) {
        this.controller.requestRepaint();
    }
    else {
        throw new Error('Cannot request a repaint: no controller configured');
        // TODO: just do a repaint when no parent is configured?
    }
};

/**
 * Request a reflow. The controller will schedule a reflow
 */
Component.prototype.requestReflow = function () {
    if (this.controller) {
        this.controller.requestReflow();
    }
    else {
        throw new Error('Cannot request a reflow: no controller configured');
        // TODO: just do a reflow when no parent is configured?
    }
};

/**
 * Event handler
 * @param {String} event       name of the event, for example 'click', 'mousemove'
 * @param {function} callback  callback handler, invoked with the raw HTML Event
 *                             as parameter.
 */
Component.prototype.on = function (event, callback) {
    // TODO: rethink the way of event delegation
    if (this.parent) {
        this.parent.on(event, callback);
    }
    else {
        throw new Error('Cannot attach event: no root panel found');
    }
};