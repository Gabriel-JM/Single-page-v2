const parser = {
  title: parseTitle,
  html: name => `${name}.html`,
  css: name => `${name}.css` 
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
