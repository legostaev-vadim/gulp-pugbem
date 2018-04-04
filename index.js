function pugbem(tokens) {
    'use strict';

    let tag = {},
        block = {},
        blockArray = [],
        element = {},
        modifier = {},
        separator = {};

    separator.elem = this.e || '__',
    separator.mod = this.m || '--';


    tokens.forEach(token => {
        
        if (token.type === 'tag') {

            tag.line = token.loc.start.line; 
            tag.column = token.loc.start.column;

        } else if (token.type === 'class') {

            // ----------- if Block -----------
            if (token.val.match(/^[a-zA-Z]/)) {

                if (block.line === token.loc.start.line) return;

                block.line = token.loc.start.line;
                if (block.line === tag.line) block.column = tag.column;
                else block.column = token.loc.start.column;

                for (let i = 0, length = blockArray.length; i < length; i++) {
                    if (block.column <= blockArray[i].column) {
                        blockArray.length = i;
                        element = {};
                        modifier = {};
                        break;
                    }
                }

                blockArray.push({line: block.line, column: block.column, val: token.val});

            }
            // ----------- if Element -----------
            else if (token.val.match(/^\_/)) {

                if (!blockArray.length) return;
                if (element.line === token.loc.start.line) return;

                element.line = token.loc.start.line;
                if (element.line === tag.line) element.column = tag.column;
                else element.column = token.loc.start.column;

                // ----------- the mix -----------
                if (element.line === blockArray[blockArray.length - 1].line) {
                    for (const iterator of [...blockArray].reverse()) {
                        if (element.line !== iterator.line) {
                            token.val = token.val.replace(/^\_\_?/, iterator.val + separator.elem);
                            break;
                        }
                    }
                }
                // ----------- the element -----------
                else {
                    for (let i = 0, length = blockArray.length; i < length; i++) {
                        if (element.column <= blockArray[i].column) {
                            blockArray.length = i;
                            break;
                        }
                    }
                    if (!blockArray.length) return;
                    token.val = token.val.replace(/^\_\_?/, blockArray[blockArray.length - 1].val + separator.elem);
                }

                element.val = token.val;

            }
            // ----------- if Modifier -----------
            else if (token.val.match(/^\-/)) {

                if (!blockArray.length) return;
                if (blockArray.length === 1 && element.line === blockArray[blockArray.length - 1].line) return;

                modifier.line = token.loc.start.line;

                if (modifier.line === element.line) {
                    token.val = token.val.replace(/^\-\-?/, element.val + separator.mod);
                } else if (modifier.line === blockArray[blockArray.length - 1].line) {
                    token.val = token.val.replace(/^\-\-?/, blockArray[blockArray.length - 1].val + separator.mod);
                }

            }
        }
    });

    return tokens;
}

module.exports = {
    postLex: pugbem
}
