function pugbem(tokens) {
    'use strict';
    
    var block = {tokens: []},
        element = {},
        tag = {},
        elem,
        mod,
        pos;
    
    
    elem = this.e ? this.e : '__';
    mod = this.m ? this.m : '--';
    
    
    function positioning(token) {
        
        if (token.line == tag.line) {
            return tag.col;
        } else {
            return token.col;
        }
        
    }
    
    function alignment(col) {
        
        for (var i = 0, len = block.tokens.length; i < len; i++) {
            if (col <= block.tokens[i].col) {
                block.tokens.length = i;
                break;
            }
        }
        
    }
    
    
    tokens.forEach(function (token) {
        
        if (token.type == 'tag') {
            tag = token;
        }
        
        if (token.type == 'class') {
            
            // ------- Block -------
            if (token.val.match(/^[a-zA-Z]/)) {
                
                block.col = positioning(token);
                alignment(block.col);
                
                block.tokens.push({line: token.line, col: block.col, val: token.val});
                
            }
            // ------- Element -------
            else if (token.val.match(/^\_/)) {
                
                element.col = positioning(token);
                alignment(element.col);
                
                element.line = token.line;
                pos = 1;
                
                // ------- Mix -------
                if (element.line == block.tokens[block.tokens.length - 1].line && block.tokens.length > 1) {
                    pos = 2;
                }
                
                if (block.tokens.length) {
                    token.val = token.val.replace(/^\_\_?/, block.tokens[block.tokens.length - pos].val + elem);
                }
                
                element.val = token.val;
                
            }
            // ------- Modifier -------
            else if (token.val.match(/^\-/)) {
                
                if (token.line == element.line) {
                    token.val = token.val.replace(/^\-\-?/, element.val + mod);
                } else if (block.tokens.length) {
                    token.val = token.val.replace(/^\-\-?/, block.tokens[block.tokens.length - 1].val + mod);
                }
                
            }
        }
        
    });
    
    return tokens;
}


module.exports = {
    
    postLex: pugbem
    
}
