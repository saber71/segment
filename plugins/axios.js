import {eventBus, SHOW_LOGIN__CARD} from "../assets/js/event-bus";

export default function ({$axios, redirect}) {
  $axios.onRequest(config => {
    console.log(config.method + ':' + config.url)
  })

  $axios.onRequestError(err => {
    alert(JSON.stringify(err))
  })

  $axios.onResponse(response => {
    console.log(response)
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      eventBus.$emit(SHOW_LOGIN__CARD)
    }
  })
}
