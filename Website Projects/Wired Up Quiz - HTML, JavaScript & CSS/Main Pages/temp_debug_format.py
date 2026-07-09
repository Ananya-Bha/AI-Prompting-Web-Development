import re

code = '<form>\n  <input type="email" placeholder="Enter email">\n  <button type="submit">Submit</button>\n</form>'
escaped = code.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
comments = re.sub(r'(//[^\n]*|/\*[\s\S]*?\*/)', r'<span class="token-comment">\1</span>', escaped)
strings = re.sub(r'(`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|\'(?:(?:[^'\\]|\\.)*)\')', r'<span class="token-string">\1</span>', comments)

def repl(m):
    open_ = m.group(1)
    tag = m.group(2)
    attrs = m.group(3)
    close = m.group(4)
    attrString = re.sub(r'([a-zA-Z-]+)=', r'<span class="token-attr">\1</span>=', attrs)
    wrappedOpen = open_.replace('&lt;/', '<span class="token-angle">&lt;/</span>').replace('&lt;', '<span class="token-angle">&lt;</span>')
    wrappedClose = close.replace('&gt;', '<span class="token-angle">&gt;</span>')
    return f'{wrappedOpen}<span class="token-tag">{tag}</span>{attrString}{wrappedClose}'
htmlTags = re.sub(r'(&lt;\/?)([a-zA-Z][a-zA-Z0-9-]*)([^&gt;]*?)(&gt;)', repl, strings)
keywords = re.sub(r'\b(let|const|var|function|class|constructor|return|if|else|for|while|switch|case|break|default|new|document|getElementById|textContent|alert)\b', r'<span class="token-keyword">\1</span>', htmlTags)
print(keywords)
