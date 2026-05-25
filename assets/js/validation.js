/**
 * Client-Side Validation
 */

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.errors = {};
    }
    
    validate(rules) {
        this.errors = {};
        
        for (const [fieldName, fieldRules] of Object.entries(rules)) {
            const input = this.form.querySelector(`[name="${fieldName}"]`);
            if (!input) continue;
            
            const value = input.value.trim();
            
            for (const rule of fieldRules) {
                const [ruleName, ...params] = rule.split(':');
                
                switch (ruleName) {
                    case 'required':
                        if (!value) {
                            this.addError(fieldName, `${this.formatFieldName(fieldName)} is required to continue.`);
                        }
                        break;
                        
                    case 'email':
                        if (value && !isValidEmail(value)) {
                            this.addError(fieldName, 'Enter a valid email address to continue.');
                        }
                        break;
                        
                    case 'min':
                        if (value && value.length < parseInt(params[0])) {
                            const minimumMessage = fieldName.toLowerCase().includes('password')
                                ? `${this.formatFieldName(fieldName)} must be at least ${params[0]} characters long.`
                                : `${this.formatFieldName(fieldName)} must be at least ${params[0]} characters.`;
                            this.addError(fieldName, minimumMessage);
                        }
                        break;
                        
                    case 'max':
                        if (value && value.length > parseInt(params[0])) {
                            this.addError(fieldName, `${this.formatFieldName(fieldName)} must not exceed ${params[0]} characters.`);
                        }
                        break;
                        
                    case 'match':
                        const targetInput = this.form.querySelector(`[name="${params[0]}"]`);
                        if (value && targetInput && value !== targetInput.value) {
                            const targetName = this.formatFieldName(params[0]);
                            this.addError(fieldName, `${this.formatFieldName(fieldName)} must match ${targetName}.`);
                        }
                        break;
                        
                    case 'phone':
                        if (value && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/.test(value)) {
                            this.addError(fieldName, 'Enter a valid phone number, such as +1234567890.');
                        }
                        break;
                        
                    case 'number':
                        if (value && isNaN(value)) {
                            this.addError(fieldName, `${this.formatFieldName(fieldName)} must be a number.`);
                        }
                        break;
                }
            }
        }
        
        return Object.keys(this.errors).length === 0;
    }
    
    addError(fieldName, message) {
        if (!this.errors[fieldName]) {
            this.errors[fieldName] = [];
        }
        this.errors[fieldName].push(message);
    }
    
    getErrors() {
        return this.errors;
    }
    
    formatFieldName(fieldName) {
        return fieldName
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }
    
    displayErrors() {
        clearFormErrors(this.form.id);
        displayFormErrors(this.errors, this.form.id);
    }
}

// Real-time password strength display
function setupPasswordStrengthMeter(inputId, meterId) {
    const input = document.getElementById(inputId);
    const meter = document.getElementById(meterId);
    
    if (!input || !meter) return;
    
    input.addEventListener('input', function() {
        const strength = getPasswordStrength(this.value);
        const label = getPasswordStrengthLabel(strength);
        const color = getPasswordStrengthColor(strength);
        
        meter.textContent = `Password Strength: ${label}`;
        meter.style.color = color;
        meter.style.display = this.value ? 'block' : 'none';
    });
}

// Setup form submit handlers
function setupFormValidation(formId, rules, submitCallback) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const validator = new FormValidator(formId);
        if (validator.validate(rules)) {
            submitCallback(new FormData(form));
        } else {
            validator.displayErrors();
        }
    });
}
