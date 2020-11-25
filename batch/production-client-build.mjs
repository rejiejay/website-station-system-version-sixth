/**
 * development client build
 * need first: npm run build-ts
 */
import http from './../build/app/module/http-service'

http.initWebLibrary()
http.buildClient(configuration)