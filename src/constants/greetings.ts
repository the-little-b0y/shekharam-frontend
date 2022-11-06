import { VaInterface, GetUserInterface } from '../contracts/userInterface'

export const vaIcons: VaInterface[] = Array.from(Array(35).keys()).map(item => {
    const vaIcon: VaInterface = {
        name: `va-${String(item + 1)}`,
        value: require(`../assets/images/va-${String(item + 1)}.png`)
    }
    return vaIcon
})

export const greetings: string[] = ['Hello, ', 'Hi, ', 'Hola, ']

export const getTimeGreeting = () => {
    const currentTime = new Date().getHours();
    const greeting = ((currentTime >=3 && currentTime < 12) ? 'Good Morning, ' : (currentTime >=12 && currentTime < 16) ? 'Good Afternoon, ' : 'Good Evening, ')
    return greeting
}

export const getMyVaIcon = (user: GetUserInterface | undefined) => {
    let selectedVa = vaIcons[0]
    if(user && user.va) {
        const theVa = vaIcons.find(icon => icon.name === user.va)
        selectedVa = theVa ? theVa : vaIcons[0]
    }
    return selectedVa.value
}
