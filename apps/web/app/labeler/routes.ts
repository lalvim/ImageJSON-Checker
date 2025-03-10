import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const LabelingController = () => import('#labeler/controllers/labeling_controller')

router.group(() => {
  router.get('/labels', [LabelingController, 'index']).as('labels.index')
  router.get('/label/:filename', [LabelingController, 'show']).as('labels.show')
  router.post('/labels', [LabelingController, 'store']).as('labels.store')
}).middleware(middleware.auth())
