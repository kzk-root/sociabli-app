import demoModel, { DemoModel } from '@/store/model/demo'

export interface StoreModel {
  demo: DemoModel
}

const storeModel: StoreModel = {
  demo: demoModel,
}

export default storeModel
