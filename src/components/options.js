
import {
    calcDisplaySize,
    backgroundImage,
    backgroundImageFill
} from '@/utils/tool.js'

function include (prop, includes) {
    return includes.indexOf(prop) > -1;
}

const horizontalReferenceValidator = value => ['left', 'right'].indexOf(value) > -1;
const verticalReferenceValidator = value => ['top', 'bottom'].indexOf(value) > -1;

// 定位属性
export const positionProps = () => ({
    horizontalReference: {
        type: String,
        default: 'left',
        validator: horizontalReferenceValidator
    },
    verticalReference: {
        type: String,
        default: 'top',
        validator: verticalReferenceValidator
    },
    left: {
        type: [Number, String],
        default: 0
    },
    right: {
        type: [Number, String],
        default: 0
    },
    top: {
        type: [Number, String],
        default: 0
    },
    bottom: {
        type: [Number, String],
        default: 0
    }
});

export const positionStyle = vm => ({
    left: vm.horizontalReference === 'left' ? calcDisplaySize(vm.left) : void 0,
    right: vm.horizontalReference === 'right' ? calcDisplaySize(vm.right) : void 0,
    top: vm.verticalReference === 'top' ? calcDisplaySize(vm.top) : void 0,
    bottom: vm.verticalReference === 'bottom' ? calcDisplaySize(vm.bottom) : void 0
})

// padding属性
export const paddingProps = includes => {
    if(typeof includes === 'string') {
        return {
            paddingTop: include('top', includes) ? [Number, String] : void 0,
            paddingLeft: include('left', includes) ? [Number, String] : void 0,
            paddingRight: include('right', includes) ? [Number, String] : void 0,
            paddingBottom: include('bottom', includes) ? [Number, String] : void 0,
        }
    }
    return {
        paddingTop: [Number, String],
        paddingLeft: [Number, String],
        paddingRight: [Number, String],
        paddingBottom: [Number, String]
    }
}

export const paddingStyle = vm => ({
    paddingTop: calcDisplaySize(vm.paddingTop),
    paddingLeft: calcDisplaySize(vm.paddingLeft),
    paddingRight: calcDisplaySize(vm.paddingRight),
    paddingBottom: calcDisplaySize(vm.paddingBottom)
})

// margin
export const marginProps = includes => {
    if(typeof includes === 'string') {
        return {
            marginTop: include('top', includes) ? [Number, String] : void 0,
            marginLeft: include('left', includes) ? [Number, String] : void 0,
            marginRight: include('right', includes) ? [Number, String] : void 0,
            marginBottom: include('bottom', includes) ? [Number, String] : void 0,
        }
    }
    return {
        marginTop: [Number, String],
        marginLeft: [Number, String],
        marginRight: [Number, String],
        marginBottom: [Number, String]
    }
}

export const marginStyle = vm => ({
    marginTop: calcDisplaySize(vm.marginTop),
    marginLeft: calcDisplaySize(vm.marginLeft),
    marginRight: calcDisplaySize(vm.marginRight),
    marginBottom: calcDisplaySize(vm.marginBottom)
})

// border
export const borderProps = () => ({
    borderWidth: [Number, String],
    borderColor: String,
    borderStyle: {
        type: String,
        default: 'none'
    },
    borderRadius: [Number, String]
})

export const borderStyle = vm => ({
    borderWidth: calcDisplaySize(vm.borderWidth),
    borderColor: vm.borderColor,
    borderStyle: vm.borderStyle,
    borderRadius: calcDisplaySize(vm.borderRadius)
})

// overflow
export const overflowProps = () => ({
    overflow: {
        type: String,
        default: ''
    },
    hideScrollbar: {
        type: Boolean,
        default: false
    }
})

// background
export const backgroundProps = () => ({
    backgroundColor: String,
    backgroundImage: String,
    backgroundImageFill: {
        type: String,
        default: 'center'
    }
})

export const backgroundStyle = vm => ({
    backgroundColor: vm.backgroundColor,
    backgroundImage: backgroundImage(vm.backgroundImage),
    ...backgroundImageFill(vm.backgroundImageFill),
})

// 动画属性
export const animateProps = () => ({
    animate: {
        type: Boolean,
        default: false
    },
    animateName: {
        type: String,
        default: ''
    },
    // fast / faster / slow / slower
    animateSpeed: {
        type: String,
        default: ''
    },
    animateInfinite: {
        type: Boolean,
        default: false
    },
    // 1 / 2 / 3 / 4 / 5
    animateDelay: {
        type: String,
        default: ''
    }
});

export const animateComputedClasses = function () {
    if(!this.animate || !this.animateName) return {};
    return {
        animated: true,
        [this.animateName]: this.animateName,
        [this.animateSpeed]: this.animateSpeed,
        infinite: this.animateInfinite,
        [`delay-${this.animateDelay}s`]: this.animateDelay
    }
}
