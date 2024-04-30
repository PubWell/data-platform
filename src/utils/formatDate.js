/*
 * @Author: 肉肉
 * @Date: 2022-12-01 13:30:38
 * @LastEditors: 肉肉
 * @LastEditTime: 2023-09-15 16:16:29
 * @FilePath: /vue-naive-admin-main/src/utils/formateDate.js
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name}, All Rights Reserved. 
 */
/**
 * Created by zad on 17/5/18.
 */
/**
 * format Date to String
 * @param {Date} date
 * @param {String} fmt
 * @param {Boolean} [flag = true]
 * @return {String}
 */
export default function formatDate(date, fmt = 'yyyy-MM-dd hh:mm:ss', flag = true) {
  /**
   * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
   * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
   * formatDate(new Date(),'yyyy-MM-dd') ==> 2014-03-02
   * formatDate(new Date(),'yyyy-MM-dd hh:mm') ==> 2014-03-02 05:04
   * formatDate(new Date(),'yyyy-MM-dd HH:mm') ==> 2014-03-02 17:04
   * formatDate(new Date(),'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
   * formatDate(new Date(),'yyyy-MM-dd E HH:mm:ss') ==> 2009-03-10 二 20:09:04
   * formatDate(new Date(),'yyyy-MM-dd EE hh:mm:ss') ==> 2009-03-10 周二 08:09:04
   * formatDate(new Date(),'yyyy-MM-dd EEE hh:mm:ss') ==> 2009-03-10 星期二 08:09:04
   * formatDate(new Date(),'yyyy-M-d h:m:s.S') ==> 2006-7-2 8:9:4.18
   */
  if (!date) {
    return ''
  }
  let hour = date.getHours()
  if (!flag) {
    if (date.getHours() % 12 === 0) {
      hour = 12
    } else {
      hour = date.getHours() % 12
    }
  }
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': hour, // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  }
  const week = {
    0: '\u65e5',
    1: '\u4e00',
    2: '\u4e8c',
    3: '\u4e09',
    4: '\u56db',
    5: '\u4e94',
    6: '\u516d',
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length))
  }

  if (/(E+)/.test(fmt)) {
    if (RegExp.$1.length > 1) {
      if (RegExp.$1.length > 2) {
        fmt = fmt.replace(RegExp.$1, `\u661f\u671f${week[`${date.getDay()}`]}`)
      } else {
        fmt = fmt.replace(RegExp.$1, `\u5468${week[`${date.getDay()}`]}`)
      }
    } else {
      fmt = fmt.replace(RegExp.$1, week[`${date.getDay()}`])
    }
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length))
    }
  }
  return fmt
}
