import axios from './index'
import { ApiResponse } from '../contracts/axiosInterface';
import { CollectionItemTypeInterface, ConditionTypeInterface, GetConfigurationReturnInterface } from '../contracts/configurationInterface';

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
const CONFIGURATIONSERVICE_ROUTE = `${BACKEND_API_URL}/configuration`
const COLLECTIONITEMTYPESERVICE_ROUTE = `${CONFIGURATIONSERVICE_ROUTE}/collectionitemtype`
const CONDITIONTYPESERVICE_ROUTE = `${CONFIGURATIONSERVICE_ROUTE}/conditiontype`

export const postCollectionItemType = async (collectionItemType: CollectionItemTypeInterface) => {
    const response = await axios.post<ApiResponse>(COLLECTIONITEMTYPESERVICE_ROUTE, collectionItemType)
    return response.data
}

export const getConfiguration = async () => {
    const response = await axios.get<GetConfigurationReturnInterface>(CONFIGURATIONSERVICE_ROUTE)
    return response.data
}

export const putCollectionItemType = async (collectionItemType: CollectionItemTypeInterface) => {
    const response = await axios.put<ApiResponse>(COLLECTIONITEMTYPESERVICE_ROUTE, collectionItemType)
    return response.data
}

export const deleteCollectionItemType = async (id: string) => {
    const response = await axios.delete<ApiResponse>(COLLECTIONITEMTYPESERVICE_ROUTE, {params: {_id: id}})
    return response.data
}

export const postConditionType = async (conditionType: ConditionTypeInterface) => {
    const response = await axios.post<ApiResponse>(CONDITIONTYPESERVICE_ROUTE, conditionType)
    return response.data
}

export const putConditionType = async (conditionType: ConditionTypeInterface) => {
    const response = await axios.put<ApiResponse>(CONDITIONTYPESERVICE_ROUTE, conditionType)
    return response.data
}

export const deleteConditionType = async (id: string) => {
    const response = await axios.delete<ApiResponse>(CONDITIONTYPESERVICE_ROUTE, {params: {_id: id}})
    return response.data
}
