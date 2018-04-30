const reg_block = /^[a-zA-Z]/,
    reg_elem = /^\_/,
    reg_mod = /^\-/,
    repl_elem = /^\_\_?/,
    repl_mod = /^\-\-?/;

function pugbem(tokens) {
    'use strict';

    let tag_line,
        tag_column,
        class_line,
        class_column,
        block_line,
        blocks = [],
        element_line,
        element_val,
        modifier_line,
        separator_elem = this.e || '__',
        separator_mod = this.m || '--';

    Object.defineProperty(blocks, 'last', {
        get: function() {
            if (!this.length) return false;
            return this[this.length - 1];
        }
    });

    tokens.forEach(token => {
        
        if (token.type === 'tag') {

            tag_line = token.loc.start.line; 
            tag_column = token.loc.start.column;

        } else if (token.type === 'class') {

            class_line = token.loc.start.line;
            if (class_line === tag_line) class_column = tag_column;
            else class_column = token.loc.start.column;

            if (class_line !== blocks.last.line) {
                blocks.forEach((elem, i, arr) => {
                    if (class_column <= elem.column) {
                        arr.length = i;
                        return;
                    }
                });
            }

            // ----------- if Block -----------
            if (token.val.match(reg_block)) {

                if (class_line === block_line) return;
                if (class_line === element_line) return;
                if (class_line === modifier_line) return;

                block_line = class_line;
                blocks.push({line: block_line, column: class_column, val: token.val});

            }
            // ----------- if Element -----------
            else if (token.val.match(reg_elem)) {

                if (!blocks.length) return;
                if (class_line === element_line) return;
                
                element_line = class_line;

                // ----------- the mix -----------
                if (element_line === blocks.last.line) {
                    for (const iter of [...blocks].reverse()) {
                        if (element_line !== iter.line) {
                            token.val = token.val.replace(repl_elem, iter.val + separator_elem);
                            break;
                        }
                    }
                }
                // ----------- the element -----------
                else {
                    token.val = token.val.replace(repl_elem,  blocks.last.val + separator_elem);
                }

                element_val = token.val;

            }
            // ----------- if Modifier -----------
            else if (token.val.match(reg_mod)) {

                if (!blocks.length) return;

                modifier_line = class_line;

                if (class_line === element_line) {
                    if (blocks.length === 1 && element_line === blocks.last.line) return;
                    token.val = token.val.replace(repl_mod, element_val + separator_mod);
                } else if (class_line === blocks.last.line) {
                    token.val = token.val.replace(repl_mod, blocks.last.val + separator_mod);
                }

            }
        }
    });

    return tokens;
}

module.exports = {
    postLex: pugbem
}
