/***
  Current component attributes:
  - html: name or path to component's html.
  - css: name or path to component's css, if doesn't has css set this to "false" or "null".
  - folder: folder name of current component, put this only if the attribute name is
    diferent than the folder name.
  - title: title who is going to be replaced when change routes.
  - path: the path to the current component.
  - init: a function who contains the logic of the component.
  - name: default value of the title, html, css, folder and path attributes, use only if
    one of them has the same or similar value, for example: {
      html: 'comp.html',
      css: 'comp.css,
      folder: 'comp',
      title: 'Comp',
      path: '/comp'
    },
    the parser will make the needed changes on every attribute that is "undefined",
    that is, attributes who is not setted.
*/

const parser = {
  title: parseTitle,
  html: name => `${name}.html`,
  css: name => `${name}.css`,
  path: name => `/${name}`
}

function parseTitle(name) {
  const firstLetter = name.charAt(0)
  const nameArray = name.split('')
  nameArray[0] = firstLetter.toUpperCase()
  return nameArray.join('')
}

export default function parseComponents(components) {
  return components.map(component => {
    const { name } = component
    const keys = ['path', 'folder', 'title', 'html', 'css']
    
    keys.forEach(key => {
      if(component[key] === undefined) {
        const hasParser = key in parser
        component[key] = hasParser ? parser[key](name) : name
      }
    })

    return component
  })
}
