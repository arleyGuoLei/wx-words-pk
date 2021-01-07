const loadingText = '···'

const propType = {
  type: Number,
  optionalTypes: [String],
  value: loadingText
}

Component({
  properties: {
    grade: propType,
    pvpNumber: propType,
    winNumber: propType
  }
})
