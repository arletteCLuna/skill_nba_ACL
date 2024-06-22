/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

// i18n dependencies. i18n is the main module, sprintf allows us to include variables with '%s'.
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// We create a language strings object containing all of our strings. 
// The keys for each string will then be referenced in our code
// e.g. requestAttributes.t('WELCOME')
const languageStrings = {
    'es': {
        translation: {
            WELCOME_MSG: '¡Hola Arlette! Gracias por usar Curiosidades del Baloncesto, para comenzar puedes decir: datos sobre el basquet, hablame sobre el basquet... Para detener di ¡Cancela!',
            GET_FACT_MSG: 'Aquí te va un dato Arlette... ',
            HELP_MSG: 'Puedes decir: hablame sobre el basquet. ¿Cómo te puedo ayudar?',
            GOODBYE_MSG: '¡Adiós Arlette!',
            FALLBACK_MSG: 'Lo siento, no sé sobre eso. Por favor, inténtalo de nuevo.',
            ERROR_MSG: 'Lo siento, tuve problemas para hacer lo que pediste. Por favor, inténtalo de nuevo.'
        }
    },
    'en': {
        translation: {
            WELCOME_MSG: 'Hello Arlette! Thank you for using Basketball Curiosities, to start you can say: facts about basketball, tell me about basketball... To stop say Cancel!',
            GET_FACT_MSG: 'A fun fact is Arlette... ',
            HELP_MSG: 'You can say: tell me about basketball. How can I help?',
            GOODBYE_MSG: 'Goodbye!',
            FALLBACK_MSG: 'Sorry, I don\'t know about that. Please try again.',
            ERROR_MSG: 'Sorry, I had trouble doing what you asked. Please try again.'
        }
    }
};

const data = {
    "es": [
        "¿Sabías qué? Michael Jordan ganó seis campeonatos de la NBA con los Chicago Bulls.",
        "¿Sabías qué? La línea de tres puntos en la NBA está a 7.24 metros del aro.",
        "¿Sabías qué? Kareem Abdul-Jabbar es el máximo anotador en la historia de la NBA.",
        "¿Sabías qué? El primer juego de baloncesto se jugó con un balón de fútbol y canastas de melocotón.",
        "¿Sabías qué? Los Boston Celtics tienen el récord de más campeonatos ganados en la historia de la NBA.",
        "¿Sabías qué? Wilt Chamberlain es el único jugador que ha anotado 100 puntos en un solo partido de la NBA.",
        "¿Sabías qué? La NBA fue fundada en 1946 como la Basketball Association of America (BAA).",
        "¿Sabías qué? El término 'slam dunk' fue popularizado por Julius Erving, también conocido como Dr. J."
    ],
    "en": [
        "Did you know? Michael Jordan won six NBA championships with the Chicago Bulls.",
        "Did you know? The three-point line in the NBA is 7.24 meters (23.75 feet) from the basket.",
        "Did you know? Kareem Abdul-Jabbar is the all-time leading scorer in NBA history.",
        "Did you know? The first basketball game was played with a soccer ball and peach baskets.",
        "Did you know? The Boston Celtics hold the record for the most championships won in NBA history.",
        "Did you know? Wilt Chamberlain is the only player to have scored 100 points in a single NBA game.",
        "Did you know? The NBA was founded in 1946 as the Basketball Association of America (BAA).",
        "Did you know? The term 'slam dunk' was popularized by Julius Erving, also known as Dr. J."
    ]
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = t('WELCOME_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const FrasesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FrasesIntent';
    },
    handle(handlerInput) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const locale = handlerInput.requestEnvelope.request.locale;
        const frasesArray = locale.startsWith('es') ? data["es"] : data["en"];
        const GET_FACT_MSG = t('GET_FACT_MSG');

        const frasesIndice = Math.floor(Math.random() * frasesArray.length);
        const randomFrase = frasesArray[frasesIndice];
        const speakOutput = GET_FACT_MSG + randomFrase;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput) // Keep the session open by adding a reprompt
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = t('GOODBYE_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput) // Keep the session open by adding a reprompt
            .getResponse();
    }
};

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput) // Keep the session open by adding a reprompt
            .getResponse();
    }
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const { t } = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = t('ERROR_MSG');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput) // Keep the session open by adding a reprompt
            .getResponse();
    }
};

// This request interceptor will bind a translation function 't' to the requestAttributes.
const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      fallbackLng: 'en',
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        FrasesIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(LocalizationInterceptor, LoggingRequestInterceptor)
    .addResponseInterceptors(LoggingResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();