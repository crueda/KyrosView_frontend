 var EventEnum = {
  0: "EVENTS",
  902: "ALARM",
  902: "ALARM",
  903: "PANIC",
  904: "AXA_PANIC",
  905: "THEFT",
  906: "ACCIDENT",
  907: "UNAUTHORIZE",
  908: "COERCION",
  909: "MANUAL",
  910: "LOW_BATTERY",
  911: "MAX_SPEED",
  912: "VEHICLE_STARTED",
  913: "VEHICLE_STOPPED",
  914: "SERVICE_STARTED",
  915: "SERVICE_STOPPED",
  916: "PRIVATE_MODE_ACTIVATED",
  917: "PRIVATE_MODE_DEACTIVATED",
  918: "ALARM_STATE_ACTIVATED",
  919: "ALARM_STATE_DEACTIVATED",
  920: "CLAXON_ACTIVATED",
  921: "CLAXON_DEACTIVATED",
  922: "WARNER_ACTIVATED",
  923: "WARNER_DEACTIVATED",
  924: "POWERSWITCH_ACTIVATED",
  925: "POWERSWITCH_DEACTIVATED",
  926: "SPEAKER_ACTIVATED",
  927: "SPEAKER_DEACTIVATED",
  928: "ALARM_MODE_ACTIVATED",
  929: "ALARM_MODE_DEACTIVATED",
  930: "STOP_TIME_EXCEEDED",
  931: "BRACELET_BREAK_ACTIVATED",
  932: "BRACELET_BREAK_DEACTIVATED",
  933: "BRACELET_HANDLING_ACTIVATED",
  934: "BRACELET_HANDLING_DEACTIVATED",
  935: "DEAD_MAN_ACTIVATED",
  936: "DEAD_MAN_DEACTIVATED",
  937: "AGGRESSOR_APPROACHING_ACTIVATED",
  938: "AGGRESSOR_APPROACHING_DEACTIVATED",
  939: "AGGRESSOR_AWAY_ACTIVATED",
  940: "AGGRESSOR_AWAY_DEACTIVATED",
  941: "PLUG",
  942: "UNPLUG",
  943: "POSITION_TEST",
  944: "RALLYE_MAX_SPEED_EXCEEDED",
  945: "NOT_AUTHORIZED_STOP",
  946: "NOT_AUTHORIZED_STOP_RALLY",
  947: "WORKING_SCHEDULE_KO",
  948: "OBLIGATORY_AREA_ACTIVATED",
  949: "OBLIGATORY_AREA_DEACTIVATED",
  950: "FORBIDDEN_AREA_ACTIVATED",
  951: "FORBIDDEN_AREA_DEACTIVATED",
  952: "GENERIC_AREA_ACTIVATED",
  953: "GENERIC_AREA_DEACTIVATED",
  954: "PROXIMITY_AREA_MAIN_ACTIVATED",
  955: "PROXIMITY_AREA_MAIN_DEACTIVATED",
  956: "DISTANCE_AREA_MAIN_ACTIVATED",
  957: "DISTANCE_AREA_MAIN_DEACTIVATED",
  958: "PROXIMITY_AREA_AFFECTED_ACTIVATED",
  959: "PROXIMITY_AREA_AFFECTED_DEACTIVATED",
  960: "DISTANCE_AREA_AFFECTED_ACTIVATED",
  961: "DISTANCE_AREA_AFFECTED_DEACTIVATED",
  962: "BEACON_IN",
  963: "BEACON_OUT",
  964: "BEACON_JUMPED",
  965: "FRONT_SEAT_ACTIVATED",
  966: "FRONT_SEAT_DEACTIVATED",
  967: "BACK_SEAT_ACTIVATED",
  968: "BACK_SEAT_DEACTIVATED",
  969: "FLAG_DOWN",
  970: "FLAG_UP",
  971: "TAXI_ZONE_ZERO",
  972: "TAXI_ZONE_ONE",
  973: "TAXI_ZONE_TWO",
  974: "TAXI_ZONE_THREE",
  975: "TAXI_DOOR_ACTIVATED",
  976: "TAXI_DOOR_DEACTIVATED",
  977: "FLAG_DOWN_TAXI_ZONE_ZERO",
  978: "FLAG_DOWN_TAXI_ZONE_ONE",
  979: "FLAG_DOWN_TAXI_ZONE_TWO",
  980: "FLAG_DOWN_TAXI_ZONE_THREE",
  981: "START_SPECIAL",
  982: "PAUSE_SPECIAL",
  983: "STOP_SPECIAL",
  984: "PAUSE_VEHICLE",
  985: "RESUME_VEHICLE",
  986: "INIT_LOAD",
  987: "END_LOAD",
  988: "INIT_UNLOAD",
  989: "END_UNLOAD",
  990: "STOP_NEAR_POI",
  991: "CHANGE_DRIVER",
  992: "RECORD_POI",
  993: "DRIVING_HOURS_CONTROL",
  994: "DRIVING_HOURS_CONTROL_DESCANSO_SEMANAL_MENOR_24",
  995: "DRIVING_HOURS_CONTROL_DESCANSO_SEMANAL_REDUCIDO_NO_PERMITIDO",
  996: "DRIVING_HOURS_CONTROL_DESCANSO_SEMANAL_NO_COMPESA_DESCANSO_REDUCIDO",
  997: "DRIVING_HOURS_CONTROL_DESCANSO_DIARIO_REDUCIDO_INCORRECTO",
  998: "DRIVING_HOURS_CONTROL_NO_HAY_DESCANSO_SEMANAL_O_DIARIO_EN_24",
  999: "DRIVING_HOURS_CONTROL_MAS_DE_10_HORAS_EN_EL_DIA",
  1000: "DRIVING_HOURS_CONTROL_EXCESO_CONDUCCION_DIA_2_DIAS_MAS_DE_9_HORAS",
  1001: "INDRIVING_HOURS_CONTROL_EXCESO_CONDUCCION_SEMANA_ACTUAL",
  1002: "DRIVING_HOURS_CONTROL_EXCESO_CONDUCCION_BISEMANAL",
  1003: "DRIVING_HOURS_CONTROL_EXCESO_DE_CONDUCCION_INITERRUMPIDA",
  1004: "DRIVING_HOURS_CONTROL_DESCANSOS_CONDUCCION_INSUFICIENTES",
  1005: "INTERVENTION",
  1006: "GATHERING",
  1008: "INDOOR_PANIC",
  1009: "TRACKING_INDOOR",
  1010: "DBUSCA_PHOTO",
  1011: "TAMPERING",
  1015: "TEMP0",
  1016: "TEMP1",
  1017: "TEMP2",
  1018: "TEMP3",
  1019: "HARSH_ACCELERATION",
  1020: "HARSH_BRAKING",
  1021: "PROXIMITY",
  1022: "OYSTA_PERSONAL_EVENT",
  1023: "OYSTA_CANNED_EVENT",
  1024: "OYSTA_WAYPOINT_EVENT",
  1025: "OYSTA_NFC_EVENT",
  1026: "MAX_TIME_INACTIVITY",
  1027: "BATTERY_CHARGING",
  1028: "AMBER_ALERT",
  1029: "POWER_ON",
  1030: "POWER_OFF",
  1031: "CHECKIN",
  1032: "EHEALTH",
  1033: "EMPTY_BATTERY",
  1034: "RECOVER_BATTERY",
  1035: "HARSH_CORNERING",
  1036: "RPM",
  1037: "TEMP",
  1038: "SENSOR_RANGE",
  1039: "BATTERY_CHARGING_OFF",
  1040: "OVERSPEED_AREA_ACTIVATED",
  1041: "BATTERY_LEVEL",
  1043: "DRIVER_IDENTIFICATION_ON",
  1044: "DRIVER_IDENTIFICATION_OFF",
  1045: "BEACON_NFC_READ",
  1046: "BEACON_NFC_JUMPED",
  1047: "SCAN_EVENT",
  1048: "RESTART",
  1049: "BT_EVENT",
  1050: "STOP_IN_AREA",
  1051: "SIDE_DOOR_OPENING",
  1052: "SIDE_DOOR_CLOSING",
  1053: "BACK_DOOR_OPENING",
  1054: "BACK_DOOR_CLOSING",
  1055: "JAMMER",
  properties: {
    "EVENTS": {name: "info", description: "Eventos"},
    "ALARM": {name: "alarm", description: "Alarma"},
  	"PANIC": {name: "panic", description: "Pánico"},
  	"AXA_PANIC": {name: "axa_panic", description: "Pánico"},
  	"THEFT": {name: "theft", description: "Robo"},
  	"ACCIDENT": {name: "accident", description: "Accidente"},
  	"UNAUTHORIZE": {name: "unauthorize", description: "No autorizado"},
  	"COERCION": {name: "coercion", description: "Coerción"},
  	"MANUAL": {name: "manual", description: "Alarma manual"},
  	"LOW_BATTERY": {name: "low_battery", description: "Bateria baja"},
  	"MAX_SPEED": {name: "max_speed", description: "Velocidad máxima excedida"},
  	"VEHICLE_STARTED": {name: "start", description: "Arranque"},
  	"VEHICLE_STOPPED": {name: "stop", description: "Parada"},
  	"SERVICE_STARTED": {name: "service_started", description: "Inicio de servicio"},
  	"SERVICE_STOPPED": {name: "service_stopped", description: "Parada de servicio"},
  	"PRIVATE_MODE_ACTIVATED": {name: "private_mode_activated", description: "Modo privado activado"},
  	"PRIVATE_MODE_DEACTIVATED": {name: "private_mode_deactivated", description: "Modo privado desactivado"},
  	"ALARM_STATE_ACTIVATED": {name: "alarm_state_activated", description: "Estado de alarma activado"},
  	"ALARM_STATE_DEACTIVATED": {name: "alarm_state_deactivated", description: "Estado de alarma desactivado"},
  	"CLAXON_ACTIVATED": {name: "claxon_activated", description: "Claxón activado"},
	  "CLAXON_DEACTIVATED": {name: "claxon_deactivated", description: "Claxón desactivado"},
	  "WARNER_ACTIVATED": {name: "warner_activated", description: "Warning activado"},
 	  "WARNER_DEACTIVATED": {name: "warner_deactivated", description: "Warning desactivado"},
	  "POWERSWITCH_ACTIVATED": {name: "powerswitch_activated", description: "Alimentación activada"},
	  "POWERSWITCH_DEACTIVATED": {name: "powerswitch_deactivated", description: "Alimentación desactivada"},
	  "SPEAKER_ACTIVATED": {name: "speaker_activated", description: "Altavoz activado"},
	  "SPEAKER_DEACTIVATED": {name: "speaker_deactivated", description: "Altavoz desactivado"},
	  "ALARM_MODE_ACTIVATED": {name: "alarm_mode_activated", description: "Modo de alarma activado"},
	  "ALARM_MODE_DEACTIVATED": {name: "alarm_mode_deactivated", description: "Modo de alarma desactivado"},
	  "STOP_TIME_EXCEEDED": {name: "stop_time_exceeded", description: "Tiempo de parada excedido"},
	  "BRACELET_BREAK_ACTIVATED": {name: "bracelet_break_activated", description: "Apertura de brazalete activado"},
  	"BRACELET_BREAK_DEACTIVATED": {name: "bracelet_break_deactivated", description: "Apertura de brazalete desactivado"},
  	"BRACELET_HANDLING_ACTIVATED": {name: "bracelet_handling_activated", description: "Brazalete activado"},
  	"BRACELET_HANDLING_DEACTIVATED": {name: "bracelet_handling_deactivated", description: "Brazalete desactivado"},
  	"DEAD_MAN_ACTIVATED": {name: "dead_man_activated", description: "Hombre muerto activado"},
  	"DEAD_MAN_DEACTIVATED": {name: "dead_man_deactivated", description: "Hombre muerto desactivado"},
  	"AGGRESSOR_APPROACHING_ACTIVATED": {name: "aggressor_approaching_activated", description: "Cercanía de agresor activado"},
  	"AGGRESSOR_APPROACHING_DEACTIVATED": {name: "aggressor_approaching_deactivated", description: "Cercanía de agresor desactivado"},
  	"AGGRESSOR_AWAY_ACTIVATED": {name: "aggressor_away_activated", description: "Separación de agresor activado"},
  	"AGGRESSOR_AWAY_DEACTIVATED": {name: "aggressor_away_deactivated", description: "Separación de agresor desactivado"},
  	"PLUG": {name: "plug", description: "Enchufado"},
  	"UNPLUG": {name: "unplug", description: "Desenchufado"},
  	"POSITION_TEST": {name: "position_test", description: "Test de posición"},
  	"RALLYE_MAX_SPEED_EXCEEDED": {name: "rallye_max_speed_exceeded", description: "Velocidad en rally excedida"},
  	"NOT_AUTHORIZED_STOP": {name: "not_authorized_stop", description: "Parada no autorizada"},
  	"NOT_AUTHORIZED_STOP_RALLY": {name: "not_authorized_stop_rally", description: "Parada no autorizada en rally"},
  	"WORKING_SCHEDULE_KO": {name: "working_schedule_ko", description: "Horario de trabajo"},
  	"OBLIGATORY_AREA_ACTIVATED": {name: "obligatory_area_activated", description: "Zona obligatoria activada"},
  	"OBLIGATORY_AREA_DEACTIVATED": {name: "obligatory_area_deactivated", description: "Zona obligatoria desactivada"},
  	"FORBIDDEN_AREA_ACTIVATED": {name: "forbidden_area_activated", description: "Zona prohibida activada"},
  	"FORBIDDEN_AREA_DEACTIVATED": {name: "forbidden_area_deactivated", description: "Zona prohibida desactivada"},
  	"GENERIC_AREA_ACTIVATED": {name: "generic_area_activated", description: "Zona generica activada"},
  	"GENERIC_AREA_DEACTIVATED": {name: "generic_area_deactivated", description: "Zona generica desactivada"},
  	"PROXIMITY_AREA_MAIN_ACTIVATED": {name: "proximity_area_main_activated", description: "Zona de proximidad activada"},
  	"PROXIMITY_AREA_MAIN_DEACTIVATED": {name: "proximity_area_main_deactivated", description: "Zona de proximidad desactivada"},
  	"DISTANCE_AREA_MAIN_ACTIVATED": {name: "distance_area_main_activated", description: "Zona de distancia activada"},
  	"DISTANCE_AREA_MAIN_DEACTIVATED": {name: "distance_area_main_deactivated", description: "Zona de distancia desactivada"},
  	"PROXIMITY_AREA_AFFECTED_ACTIVATED": {name: "proximity_area_affected_activated", description: "Zona de proximidad afectada activada"},
  	"PROXIMITY_AREA_AFFECTED_DEACTIVATED": {name: "proximity_area_affected_deactivated", description: "Zona de proximidad afectada desactivada"},
  	"DISTANCE_AREA_AFFECTED_ACTIVATED": {name: "distance_area_affected_activated", description: "Zona de distancia afectada activada"},
  	"DISTANCE_AREA_AFFECTED_DEACTIVATED": {name: "distance_area_affected_deactivated", description: "Zona de distancia afectada desactivada"},
  	"BEACON_IN": {name: "beacon_in", description: "Entrada en baliza"},
  	"BEACON_OUT": {name: "beacon_out", description: "Salida de baliza"},
  	"BEACON_JUMPED": {name: "beacon_jumped", description: "Salto de baliza"},
  	"FRONT_SEAT_ACTIVATED": {name: "front_seat_activated", description: "Cinturón delantero activado"},
  	"FRONT_SEAT_DEACTIVATED": {name: "front_seat_deactivated", description: "Cinturón delantero desactivado"},
  	"BACK_SEAT_ACTIVATED": {name: "back_seat_activated", description: "Cinturón trasero activado"},
 	  "BACK_SEAT_DEACTIVATED": {name: "back_seat_deactivated", description: "Cinturón trasero desactivado"},
  	"FLAG_DOWN": {name: "flag_down", description: "Bajada de bandera"},
  	"FLAG_UP": {name: "flag_up", description: "Subida de bandera"},
  	"TAXI_ZONE_ZERO": {name: "taxi_zone_zero", description: "Taxi zona 0"},
  	"TAXI_ZONE_ONE": {name: "taxi_zone_one", description: "Taxi zona 1"},
  	"TAXI_ZONE_TWO": {name: "taxi_zone_two", description: "Taxi zona 2"},
  	"TAXI_ZONE_THREE": {name: "taxi_zone_three", description: "Taxi zona 3"},
  	"TAXI_DOOR_ACTIVATED": {name: "taxi_door_activated", description: "Puerta de taxi activada"},
  	"TAXI_DOOR_DEACTIVATED": {name: "taxi_door_deactivated", description: "Puerta de taxi desactivada"},
  	"FLAG_DOWN_TAXI_ZONE_ZERO": {name: "flag_down_taxi_zone_zero", description: "Bajada de bandera en zona 0"},
  	"FLAG_DOWN_TAXI_ZONE_ONE": {name: "flag_down_taxi_zone_one", description: "Bajada de bandera en zona 1"},
  	"FLAG_DOWN_TAXI_ZONE_TWO": {name: "flag_down_taxi_zone_two", description: "Bajada de bandera en zona 2"},
  	"FLAG_DOWN_TAXI_ZONE_THREE": {name: "flag_down_taxi_zone_three", description: "Bajada de bandera en zona 3"},
  	"START_SPECIAL": {name: "start_special", description: "Arranque especial"},
  	"PAUSE_SPECIAL": {name: "pause_special", description: "Pausa especial"},
  	"STOP_SPECIAL": {name: "stop_special", description: "Parada especial"},
  	"PAUSE_VEHICLE": {name: "pause_vehicle", description: "Pausa"},
  	"RESUME_VEHICLE": {name: "resume_vehicle", description: "Reanudar"},
  	"INIT_LOAD": {name: "init_load", description: "Inico de carga"},
  	"END_LOAD": {name: "end_load", description: "Fin de carga"},
  	"INIT_UNLOAD": {name: "init_unload", description: "Inicio de descarga"},
  	"END_UNLOAD": {name: "end_unload", description: "Fin de descarga"},
  	"STOP_NEAR_POI": {name: "stop_near_poi", description: "Parada con cercanía a PDI"},
  	"CHANGE_DRIVER": {name: "change_driver", description: "Cambio de conductor"},
  	"RECORD_POI": {name: "record_poi", description: "Guardar PDI"},
  	"DRIVING_HOURS_CONTROL": {name: "driving_hours_control", description: "Control de horas de conducción"},
  	"DRIVING_HOURS_CONTROL_DESCANSO_SEMANAL_MENOR_24": {name: "driving_hours_control_descanso_semanal_menor_24", description: "Descanso semanal menor que 24h."},
  	"DRIVING_HOURS_CONTROL_DESCANSO_SEMANAL_REDUCIDO_NO_PERMITIDO": {name: "driving_hours_control_descanso_semanal_reducido_no_permitido", description: "Descanso reducido no permitido"},
  	"DRIVING_HOURS_CONTROL_DESCANSO_SEMANAL_NO_COMPESA_DESCANSO_REDUCIDO": {name: "driving_hours_control_descanso_semanal_no_compesa_descanso_reducido", description: "Descanso semanal no compensa el reducido"},
  	"DRIVING_HOURS_CONTROL_DESCANSO_DIARIO_REDUCIDO_INCORRECTO": {name: "driving_hours_control_descanso_diario_reducido_incorrecto", description: "Descanso reducido diario incorrecto"},
  	"DRIVING_HOURS_CONTROL_NO_HAY_DESCANSO_SEMANAL_O_DIARIO_EN_24": {name: "driving_hours_control_no_hay_descanso_semanal_o_diario_en_24", description: "Sin descanso semanal o diario en 24h."},
  	"DRIVING_HOURS_CONTROL_MAS_DE_10_HORAS_EN_EL_DIA": {name: "driving_hours_control_mas_de_10_horas_en_el_dia", description: "Conducción de más de 10h. en 1 día"},
  	"DRIVING_HOURS_CONTROL_EXCESO_CONDUCCION_DIA_2_DIAS_MAS_DE_9_HORAS": {name: "driving_hours_control_exceso_conduccion_dia_2_dias_mas_de_9_horas", description: "Conducción con más de 2 días de 9h."},
  	"INDRIVING_HOURS_CONTROL_EXCESO_CONDUCCION_SEMANA_ACTUAL": {name: "indriving_hours_control_exceso_conduccion_semana_actual", description: "Exceso de conducción semanal"},
  	"DRIVING_HOURS_CONTROL_EXCESO_CONDUCCION_BISEMANAL": {name: "driving_hours_control_exceso_conduccion_bisemanal", description: "Exceso de conducción bisemanal"},
  	"DRIVING_HOURS_CONTROL_EXCESO_DE_CONDUCCION_INITERRUMPIDA": {name: "driving_hours_control_exceso_de_conduccion_initerrumpida", description: "Exceso de conducción ininterrupida"},
  	"DRIVING_HOURS_CONTROL_DESCANSOS_CONDUCCION_INSUFICIENTES": {name: "driving_hours_control_descansos_conduccion_insuficientes", description: "Descansos de conducción insuficiente"},
  	"INTERVENTION": {name: "intervention", description: "Intervención"},
  	"GATHERING": {name: "gathering", description: "Agrupación"},
  	"INDOOR_PANIC": {name: "indoor_panic", description: "Pánico indoor"},
  	"TRACKING_INDOOR": {name: "tracking_indoor", description: "Tracking indoor"},
  	"DBUSCA_PHOTO": {name: "dbusca_photo", description: "Foto dbusca"},
  	"TAMPERING": {name: "tampering", description: "Manipulación"},
  	"TEMP0": {name: "temp0", description: "Temperatura"},
  	"TEMP1": {name: "temp1", description: "Temperatura"},
  	"TEMP2": {name: "temp2", description: "Temperatura"},
  	"TEMP3": {name: "temp3", description: "Temperatura"},
  	"HARSH_ACCELERATION": {name: "harsh_acceleration", description: "Aceleración brusca"},
  	"HARSH_BRAKING": {name: "harsh_braking", description: "Frenazo brusco"},
  	"PROXIMITY": {name: "proximity", description: "Proximidad"},
  	"OYSTA_PERSONAL_EVENT": {name: "oysta_personal_event", description: "Evento personal Oysta"},
  	"OYSTA_CANNED_EVENT": {name: "oysta_canned_event", description: "Evento Oysta"},
  	"OYSTA_WAYPOINT_EVENT": {name: "oysta_waypoint_event", description: "Evento de waypoint Oysta"},
  	"OYSTA_NFC_EVENT": {name: "oysta_nfc_event", description: "NFC Oysta"},
  	"MAX_TIME_INACTIVITY": {name: "max_time_inactivity", description: "Inactividad excedida"},
  	"BATTERY_CHARGING": {name: "battery_charging", description: "Carga de bateria"},
  	"AMBER_ALERT": {name: "amber_alert", description: "Alerta ambar"},
  	"POWER_ON": {name: "power_on", description: "Encendido"},
  	"POWER_OFF": {name: "power_off", description: "Apagado"},
  	"CHECKIN": {name: "checkin", description: "Chequeo"},
  	"EHEALTH": {name: "ehealth", description: "e-health"},
  	"EMPTY_BATTERY": {name: "empty_battery", description: "Bataría agotada"},
  	"RECOVER_BATTERY": {name: "recover_battery", description: "Bateria recuperada"},
  	"HARSH_CORNERING": {name: "harsh_cornering", description: "Curva brusca"},
 	  "RPM": {name: "rpm", description: "RPM"},
  	"TEMP": {name: "temp", description: "Temperatura"},
  	"SENSOR_RANGE": {name: "sensor_range", description: "Rango de sensor"},
  	"BATTERY_CHARGING_OFF": {name: "battery_charging_off", description: "Carga de batería apagada"},
  	"OVERSPEED_AREA_ACTIVATED": {name: "overspeed_area_activated", description: "Zona de velocidad excesiva activada"},
  	"BATTERY_LEVEL": {name: "battery_level", description: "Nivel de batería"},
  	"DRIVER_IDENTIFICATION_ON": {name: "driver_identification_on", description: "Identificación del conductor activada"},
  	"DRIVER_IDENTIFICATION_OFF": {name: "driver_identification_off", description: "Identificación del conductor desactivada"},
  	"BEACON_NFC_READ": {name: "beacon_nfc_read", description: "Lectura de baliza NFC"},
  	"BEACON_NFC_JUMPED": {name: "beacon_nfc_jumped", description: "Salto de baliza NFC"},
  	"SCAN_EVENT": {name: "scan_event", description: "Evento de escaner"},
  	"RESTART": {name: "restart", description: "Reinicio"},
  	"BT_EVENT": {name: "bt_event", description: "Evento BT"},
  	"STOP_IN_AREA": {name: "stop_in_area", description: "Parada en zona"},
  	"SIDE_DOOR_OPENING": {name: "side_door_opening", description: "Apertura de puerta lateral"},
  	"SIDE_DOOR_CLOSING": {name: "side_door_closing", description: "Cierre de puerta lateral"},
  	"BACK_DOOR_OPENING": {name: "back_door_opening", description: "Apertura de puerta trasera"},
  	"BACK_DOOR_CLOSING": {name: "back_door_closing", description: "Cierre de puerta trasera"},
  	"JAMMER": {name: "jammer", description: "Inhibidor GPS"}
  }
};

