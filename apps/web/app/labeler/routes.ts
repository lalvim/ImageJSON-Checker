import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const LabelingController = () => import('#labeler/controllers/labeling_controller')

router
  .get('/labels', [LabelingController, 'index'])
  .middleware(middleware.auth())
  .as('labels.index')

router
  .get('/label/:filename', [LabelingController, 'show'])
  .middleware(middleware.auth())
  .as('labels.show')

router
  .post('/labels', [LabelingController, 'store'])
  .middleware(middleware.auth())
  .as('labels.store')
