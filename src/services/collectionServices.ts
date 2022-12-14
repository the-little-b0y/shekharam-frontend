import axios from './index'
import { ApiResponse } from '../contracts/axiosInterface';
import { CollectionInterface, GetCollectionIdByCopyQRReturnInterface, GetCollectionIdBySetQRReturnInterface, GetCollectionReturnInterface, GetSingleCollectionReturnInterface } from '../contracts/collectionInterface';

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;
const COLLECTIONSERVICE_ROUTE = `${BACKEND_API_URL}/collection`
const COLLECTIONSETQRSERVICE_ROUTE = `${COLLECTIONSERVICE_ROUTE}/collectionsetqr`
const COPYQRSERVICE_ROUTE = `${COLLECTIONSERVICE_ROUTE}/copyqr`

export const postCollection = async (collection: CollectionInterface) => {
    const response = await axios.post<ApiResponse>(COLLECTIONSERVICE_ROUTE, collection)
    return response.data
}

export const getCollection = async (collectionof: string) => {
    const response = await axios.get<GetCollectionReturnInterface>(COLLECTIONSERVICE_ROUTE, {params: {collectionof: collectionof}})
    return response.data
}

export const getSingleCollection = async (id: string) => {
    const response = await axios.get<GetSingleCollectionReturnInterface>(`${COLLECTIONSERVICE_ROUTE}/${id}`)
    return response.data
}

export const getCollectionIdBySetQR = async (collectionsetqr: string) => {
    const response = await axios.get<GetCollectionIdBySetQRReturnInterface>(COLLECTIONSETQRSERVICE_ROUTE, {params: {collectionsetqr: collectionsetqr}})
    return response.data
}

export const getCollectionIdByCopyQR = async (copyqr: string) => {
    const response = await axios.get<GetCollectionIdByCopyQRReturnInterface>(COPYQRSERVICE_ROUTE, {params: {copyqr: copyqr}})
    return response.data
}

export const putCollection = async (collection: CollectionInterface) => {
    const response = await axios.put<ApiResponse>(COLLECTIONSERVICE_ROUTE, collection)
    return response.data
}

export const deleteCollection = async (id: string) => {
    const response = await axios.delete<ApiResponse>(COLLECTIONSERVICE_ROUTE, {params: {_id: id}})
    return response.data
}
