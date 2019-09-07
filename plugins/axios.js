import {eventBus, SHOW_LOGIN__CARD} from "../assets/js/event-bus";

export default function ({$axios, redirect}) {
  $axios.onRequestError(err => {
    alert(JSON.stringify(err))
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      eventBus.$emit(SHOW_LOGIN__CARD)
    }
  })
}
