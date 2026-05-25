import axios from "axios";
import Cookies from "js-cookie";
import { IOrder } from "../models/order.interface";

export const ADD_ORDER: string = "ADD_ORDER";
export const GET_ORDERS: string = "GET_ORDERS";
export const REMOVE_ORDER: string = "REMOVE_ORDER";
export const EDIT_ORDER: string = "EDIT_ORDER";

const instance = axios.create({
    baseURL: 'http://' + process.env.REACT_APP_API_URL,
    timeout: 5000,
    headers: {}
});

export function getOrders(): any {
    return async (dispatch: any) => {
        try {
            const response = await instance.get('/order', {
                headers: { auth: Cookies.get('token') }
            });
            return dispatch({ type: GET_ORDERS, orders: response.data });
        } catch (e) {
            console.log(e);
        }
    }
}

export function addOrder(order: IOrder): any {
    return async (dispatch: any) => {
        try {
            await instance.post('/order', {
                name: order.name,
                productId: order.product.id,
                amount: order.amount
            }, {
                headers: { auth: Cookies.get('token') }
            });
            return dispatch({ type: ADD_ORDER, order: order });
        } catch (e) {
            console.log(e);
        }
    }
}

export function removeOrder(id: number): any {
    return async (dispatch: any) => {
        try {
            await instance.delete('/order/' + id, {
                headers: { auth: Cookies.get('token') }
            });
            return dispatch({ type: REMOVE_ORDER, id: id });
        } catch (e) {
            console.log(e);
        }
    }
}

export function editOrder(order: IOrder): any {
    return async (dispatch: any) => {
        try {
            await instance.patch('/order/' + order.id, {
                name: order.name,
                productId: order.product.id,
                amount: order.amount
            }, {
                headers: { auth: Cookies.get('token') }
            });
            return dispatch({ type: EDIT_ORDER, order: order });
        } catch (e) {
            console.log(e);
        }
    }
}
