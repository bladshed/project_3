const forms = require('forms');

// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

// allows Caolan forms to work with bootstrap
// source: copied from the lab sheet (copied from Github pages for caolan forms)
const bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

// create one function for each form
const createSneakerForm = function(cutTypes){
     // the first arg to forms.create() is an
    // object that contains the definition of the form.
    // each property in the object defines one field in the form
    // the property name is the name of the form control
    return forms.create({
        "name":fields.string({
            'required': true,
            'errorAfterField': true            
        }),
        "brand":fields.string({
            'required': true,
            'errorAfterField': true            
        }),
        "price":fields.string({
            'required':true,
            'errorAfterField':true,
            'validators':[validators.integer(), validators.min(0)]
        }),
        "cut_type_id":fields.string({
            'label':'Cut Type',
            'required': true,
            'errorAfterField':true,
            'widget': widgets.select(), // use a dropdown select for this form
            'choices':cutTypes
        }),
        "image_url": fields.string({
            'widget': widgets.hidden() // invisible
        })
    })
}

module.exports = {bootstrapField, createSneakerForm};