import {sync} from './sync'

export const statusRender = (value: any, h: any) => (status: any) => {
  if (value == status) {
    return h('a-tag', {props: {color: '#87d068'}}, '启用')
  }

  return h('a-tag', {props: {color: '#f50'}}, '停用')
}

interface IButton {
  action: string
  title: string
  show?: (item: any) => boolean,
  confirm?: string
  popConfirm?: string
}

export const buttonsRender = (buttons: IButton[], object: any) => (row: any) => {
  const renders: any[] = []
  buttons.filter((v) => !v.show || v.show(row)).forEach((v) => {
    const handle = () => sync(async () => await object.btnClick({action: v.action, data: row}), true)
    if (v.popConfirm) {
      const popConfirm = object.$createElement('a-popconfirm', {
        props: {
          title: v.popConfirm,
          okText: '确定',
          cancelText: '取消',
        },
        on: {
          confirm: () => handle(),
        },
      }, [object.$createElement('a', {attrs: {href: '#'}}, v.title)])
      renders.push(popConfirm)
    } else {
      renders.push(object.$createElement('a', {
        on: {
          click: () => v.confirm ? object.$confirm({
            title: v.confirm,
            okText: '确定',
            cancelText: '取消',
            onOk: () => handle(),
          }) : handle(),
        },
      }, v.title))
    }

    renders.push(object.$createElement('a-divider', {props: {type: 'vertical'}}))
  })

  renders.pop()
  return object.$createElement('div', renders)
}
