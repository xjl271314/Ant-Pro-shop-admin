import moment from 'moment';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

// 图表数据格式化 默认是 x轴代表 时间 y轴代表数量

export function formatChartData(source, yAxis) {
  // let today = moment().format('YYYY-MM-DD');
  let today = '';
  if (source && source.list.length > 0) {
    source.list.map((h, index) => {
      h.x = `${today} ${h.x > 9 ? h.x : `0${h.x}`}:00 `;
      h.y = yAxis ? h.y + yAxis : h.y;
    });
  }
  return source;
}

/**
 * 返回精确的n位小数数值
 * @param num:number
 * @param dig:number
 */

export function digitToFixed(num, dig) {
  if (typeof num == 'undefined') {
    return '0.00';
  } else {
    let digit = dig ? dig : 2;
    return parseFloat(num).toFixed(digit);
  }
}

// 添加本地对象存储
export function addObjStorage(key, obj) {
  let value = JSON.stringify(obj);
  localStorage.setItem(key, value);
}
//获取本地对象存储
export function getObjStorage(key) {
  let obj = localStorage.getItem(key);
  return JSON.parse(obj);
}
// 添加本地存储
export function addStorage(key, value) {
  localStorage.setItem(key, value);
}
// 获取本地存储
export function getStorage(key) {
  return localStorage.getItem(key);
}
// 删除本地存储指定的值
export function deloneStorage(key) {
  return new Promise((resolve, reject) => {
    localStorage.removeItem(key);
  });
}
// 删除所有本地存储的值
export function delAllStorage(key) {
  return new Promise((resolve, reject) => {
    localStorage.clear();
    resolve('success');
  });
}

//构造分类数据
export function constructSortData(dataSource) {
  let a = [];
  let b = [];
  let c = [];
  // console.log('源数据', dataSource)
  if (dataSource && dataSource.length > 0) {
    //构造一级分类数据
    dataSource.forEach((element, index) => {
      a.push({
        label: element.catName,
        value: element.catId,
        children: [],
      });
    });
    //一级分类数据去重
    let objA = {};
    a = a.reduce(function(item, next) {
      objA[next.value] ? '' : (objA[next.value] = true && item.push(next));
      return item;
    }, []);
    //构造二级数据
    dataSource.forEach((element, index) => {
      a.forEach((item, i) => {
        if (element.parentId == item.value) {
          b = item.children.push({
            label: element.brandName,
            value: element.brandId,
            children: [],
          });
        }
      });
      objA = {};
      a.forEach((item, i) => {
        item.children = item.children.reduce(function(item, next) {
          objA[next.value] ? '' : (objA[next.value] = true && item.push(next));
          return item;
        }, []);
      });
    });
    //构造三级数据
    dataSource.forEach((element, index) => {
      a.forEach((aitem, i) => {
        aitem.children.forEach((item, i) => {
          if (element.brandId == item.value) {
            c = item.children.push({
              label: element.sortName,
              value: element.sortId,
            });
          }
        });
      });
    });
    return a;
  }
}

//图片转化为base64
export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

/**
 *
 * @param {*String} sn       //商品编码
 * @param {*String} weight   //商品净含量
 * @param {*String} unit     //商品规格单位
 * @param {*String} type     //商品包装形式
 */
const unitState = {
  克: 0,
  千克: 1,
  公斤: 1,
  毫克: 2,
  毫升: 3,
  升: 4,
};
const typeState = {
  瓶: 0,
  罐: 1,
  箱: 2,
  袋: 3,
  包: 4,
  打: 5,
  盒: 6,
  件: 7,
  条: 8,
};
export function constructSku(sn, weight, unit, type) {
  unit = unitState[unit] || 5;
  type = typeState[type] || 9;

  return sn + weight + unit + type;
}
