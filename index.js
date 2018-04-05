function pugbem(tokens) {
    'use strict';

    let _tag = {},
        _class = {},
        _block = {},
        blocks = [],
        _element = {},
        _modifier = {},
        _separator = {};

    _separator.elem = this.e || '__',
    _separator.mod = this.m || '--';

    function positioning(line, token) {
        if (line === _tag.line) return _tag.column;
        return token;
    }


    tokens.forEach(token => {
        
        if (token.type === 'tag') {

            _tag.line = token.loc.start.line; 
            _tag.column = token.loc.start.column;

        } else if (token.type === 'class') {

            if (blocks.length) {
                
                _class.line = token.loc.start.line;
                _class.column = positioning(_class.line, token.loc.start.column);
                
                if (_class.line !== blocks[blocks.length - 1].line) {
                    for (let i = 0, lgth = blocks.length; i < lgth; i++) {
                        if (_class.column <= blocks[i].column) {
                            blocks.length = i;
                            break;
                        }
                    }
                }
                
            }

            // ----------- if Block -----------
            if (token.val.match(/^[a-zA-Z]/)) {

                if (_block.line === token.loc.start.line) return;

                _block.line = token.loc.start.line;
                _block.column = positioning(_block.line, token.loc.start.column);

                blocks.push({line: _block.line, column: _block.column, val: token.val});

            }
            // ----------- if Element -----------
            else if (token.val.match(/^\_/)) {

                if (!blocks.length) return;
                if (_element.line === token.loc.start.line) return;

                _element.line = token.loc.start.line;

                // ----------- the mix -----------
                if (_element.line === blocks[blocks.length - 1].line) {
                    for (const iterator of [...blocks].reverse()) {
                        if (_element.line !== iterator.line) {
                            token.val = token.val.replace(/^\_\_?/, iterator.val + _separator.elem);
                            break;
                        }
                    }
                }
                // ----------- the element -----------
                else {
                    token.val = token.val.replace(/^\_\_?/,  blocks[blocks.length - 1].val + _separator.elem);
                }

                _element.val = token.val;

            }
            // ----------- if Modifier -----------
            else if (token.val.match(/^\-/)) {

                if (!blocks.length) return;

                _modifier.line = token.loc.start.line;

                if (_modifier.line === _element.line) {
                    token.val = token.val.replace(/^\-\-?/, _element.val + _separator.mod);
                } else if (_modifier.line === blocks[blocks.length - 1].line) {
                    token.val = token.val.replace(/^\-\-?/, blocks[blocks.length - 1].val + _separator.mod);
                }

            }
        }
    });

    return tokens;
}

module.exports = {
    postLex: pugbem
}
