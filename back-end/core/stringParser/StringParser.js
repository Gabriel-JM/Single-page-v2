class StringParser {

    capitalize(string) {
        const upperFirstLetter = string.charAt(0).toUpperCase()
        return upperFirstLetter + string.slice(1)
    }

    createEventName(method, pathArray) {
        let newEventName = method

        if(pathArray[1]) {
            const copyArray = pathArray.slice(1)
            copyArray.forEach(name => {
                if(name) {
                    const newName = this.capitalize(name)

                    newEventName += `By${newName}`
                }
            })
        }

        return newEventName
    }

    snakeCaseToCamelCase(string) {
        const regex = RegExp(/_/)

        if(regex.test(string)) {
            let array = string.split('_')

            array = array.map(string => {
                if(array.indexOf(string)) {
                    return this.capitalize(string)
                }

                return string
            })

            return array.join('')
        }

        return string
    }

    camelCaseToSnakeCase(string) {
        const match = string.match(/[A-Z]/)

        if(!match) { return string } 
        
        let array = string.split(match[0])

        array = array.map(string => {
            if(array.indexOf(string)) {
                string = match[0].toLowerCase() + string
            }

            return string
        })

        const newString = array.join('_')

        return this.camelCaseToSnakeCase(newString)
    }

    createUpdateQuery(tableName, obj) {
        const objAttrs = Object.keys(obj).slice(1)
        const objValues = Object.values(obj).slice(1)

        const newKeys = objAttrs.map(attr => {
            return this.camelCaseToSnakeCase(attr)
        })

        const query = `UPDATE ${tableName} SET${
                objValues.map((value, index) => {
                    return ` ${newKeys[index]} = \'${value}\'`
                })
            } WHERE id = ?
        `

        return query
    }

    parseObj(parseType, obj) {
        const objEntries = Object.entries(obj)

        const newEntries = objEntries.map(entrie => (
            [this[parseType](entrie[0]), entrie[1]]
        ))

        return Object.fromEntries(newEntries)
    }

}

module.exports = StringParser