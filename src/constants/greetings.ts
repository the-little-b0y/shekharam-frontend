import OwlAvatar from '../assets/images/owlAvatar.png'
import BearAvatar from '../assets/images/bearAvatar.png'
import FoxAvatar from '../assets/images/foxAvatar.png'
import GiraffeAvatar from '../assets/images/giraffeAvatar.png'
import PandaAvatar from '../assets/images/pandaAvatar.png'
import { AvatarInterface, GetUserInterface } from '../contracts/userInterface'

export const avatarIcons: AvatarInterface[] = [{
    name: 'owl',
    value: OwlAvatar
}, {
    name: 'bear',
    value: BearAvatar
}, {
    name: 'fox',
    value: FoxAvatar
}, {
    name: 'giraffe',
    value: GiraffeAvatar
}, {
    name: 'panda',
    value: PandaAvatar
}]

export const greetings: string[] = ['Hello, ', 'Hi, ', 'Hola, ']

export const getTimeGreeting = () => {
    const currentTime = new Date().getHours();
    const greeting = ((currentTime >=3 && currentTime < 12) ? 'Good Morning, ' : (currentTime >=12 && currentTime < 16) ? 'Good Afternoon, ' : 'Good Evening, ')
    return greeting
}

export const getMyAvatarIcon = (user: GetUserInterface | undefined) => {
    let selectedAvatar = avatarIcons[0]
    if(user && user.avatar) {
        const theAvatar = avatarIcons.find(icon => icon.name === user.avatar)
        selectedAvatar = theAvatar ? theAvatar : avatarIcons[0]
    }
    return selectedAvatar.value
}
