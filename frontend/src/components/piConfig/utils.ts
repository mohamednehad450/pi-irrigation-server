import { v4 as uuid4, validate as validateUuid } from 'uuid'
import { ConfigJson, ConfigJsonError, Pump, PumpError, Section, SectionError, ValidPin, validPinsArr, Zone, ZoneError } from "../api";
import { Duration, duration } from 'moment'


export const createEmptyConfig = (): ConfigJson => ({
    configId: uuid4(),
    name: "",
    gpioPins: validPinsArr,
    timeout: duration(5, 's'),
    zones: []
})

export const createEmptyZone = (): Zone => ({
    name: "",
    sections: [],
})

export const createEmptySection = (): Section => ({
    duration: duration(1, 'minute'),
    name: '',
    pin: validPinsArr[0]
})

export const createEmptyPump = (): Pump => ({
    name: '',
    initTime: duration(15, 'seconds'),
    pin: 15
})


const validateMinDuration = (d: Duration): string[] | undefined => {
    return d.as('s') > 0 ? undefined : ['min duration is 1 second']
}
const validateNegDuration = (d: Duration): string[] | undefined => {
    return d.as('s') >= 0 ? undefined : ['duration cannot be negative']
}

export const validateConfig = (config: ConfigJson): { err: ConfigJsonError, isValid: boolean } => {

    const zonesErr = config.zones.map(z => validateZone(z, config.gpioPins))
    const err = {
        configId: validateUuid(config.configId) ? undefined : ['Invalid uuid'],
        name: config.name ? undefined : ['This field cannot be empty'],
        timeout: validateNegDuration(config.timeout),
        non_field_errors: config.zones.length > 0 ? undefined : ['Each config must contain at least 1 zone'],
        zones: zonesErr.map(z => z.err)
    }
    return {
        err,
        isValid: !err.configId?.length && !err.name?.length && !err.timeout?.length && !err.non_field_errors?.length && zonesErr.every(z => z.isValid),
    }
}

export const validateZone = (z: Zone, pins: ValidPin[]): { err: ZoneError, isValid: boolean } => {
    const selectedPins = z.sections.map(s => s.pin)
    z.pump && selectedPins.push(z.pump.pin)

    const pumpErr = z.pump && validatePump(z.pump, pins, selectedPins)
    const sectionsErr = z.sections.map(s => validateSection(s, pins, selectedPins))
    const err = {
        name: z.name ? undefined : ['This field cannot be empty'],
        sections: sectionsErr.map(s => s.err),
        pump: pumpErr?.err,
        non_field_errors: z.sections.length > 0 ? undefined : ['Each zone must contain at least 1 section'],
    }
    return {
        err,
        isValid: !err.name?.length && !err.non_field_errors?.length && (pumpErr ? pumpErr.isValid : true) && sectionsErr.every(s => s.isValid)
    }
}


export const validateSection = (s: Section, pins: ValidPin[], selectedPins: ValidPin[]): { err: SectionError, isValid: boolean } => {
    const pin = []
    !!!pins.find(p => p === s.pin) && pin.push('Pin must be in gpioPins');
    selectedPins.filter(p => p === s.pin).length > 1 && pin.push('Pin already selected');

    const err = {
        duration: validateMinDuration(s.duration),
        pin,
        name: s.name ? undefined : ['This field cannot be empty']
    }
    return {
        err,
        isValid: !err.name?.length && !err.pin.length && !err.duration?.length
    }
}

export const validatePump = (p: Pump, pins: ValidPin[], selectedPins: ValidPin[]): { err: PumpError, isValid: boolean } => {
    const pin = []
    !!!pins.find(sp => sp === p.pin) && pin.push('Pin must be in gpioPins');
    selectedPins.filter(sp => sp === p.pin).length > 1 && pin.push('Pin already selected');

    const err = {
        name: p.name ? undefined : ['This field cannot be empty'],
        pin,
        initTime: validateMinDuration(p.initTime),

    }
    return {
        err,
        isValid: !err.name?.length && !err.pin.length && !err.initTime?.length
    }
}
