import Mock from 'mockjs'
import {GET_USER_INFO} from "./_url";
import {genUser} from "./type";

const mock = Mock.mock

mock(GET_USER_INFO, 'get', () => {
  return genUser()
})
