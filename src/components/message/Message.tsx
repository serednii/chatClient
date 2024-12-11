import { memo, useRef, useState, useEffect } from "react";
import { AiTwotoneDelete } from "react-icons/ai";
import { MdOutlineModeEdit } from "react-icons/md";
import DateHourComponent from "../DateHourComponent";
import { IData } from "./interface";
import controllerMessages from "./controllerMessage";
import FormMessage from "./FormMessage";
import DateDayComponent from "../DateDayComponent";
import styles from "./Messages.module.scss";
import { observer } from "mobx-react-lite";

interface MessageProps {
  id: number;
  startLastUserRef: boolean;
  MyClassName: string;
  author: string;
  message: string;
  date: string;
  itsMe: boolean;
  returnRef: (ref: HTMLLIElement | null) => void;
  setBlockLastUserRef: (value: boolean) => void;
  isPrevDey: boolean;
}

const Message: React.FC<MessageProps> = ({
  author,
  message,
  startLastUserRef,
  id,
  date,
  MyClassName,
  itsMe,
  returnRef,
  setBlockLastUserRef,
  isPrevDey,
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const lastUserRef = useRef<HTMLLIElement | null>(null);
  const [isEditMessage, setIsEditMessage] = useState(false);
  const [values, setValues] = useState<string>("");
  const [data, setData] = useState<IData>({ dataIdStr: "", dataMessage: "" });

  useEffect(() => {
    if (startLastUserRef && lastUserRef.current) {
      // console.log("MMMMMMMMMMMMMMMMM", lastUserRef);
      returnRef(lastUserRef.current);
    }
  }, [startLastUserRef, lastUserRef, returnRef]);

  // console.log(date);
  return (
    <li
      data-id={id}
      key={id}
      ref={lastUserRef}
      className={`${styles.message} ${MyClassName}`}
      style={isPrevDey ? { paddingTop: "27px" } : {}}
    >
      {isPrevDey && (
        <div className={styles.message__date_day}>
          <DateDayComponent date={date} />
        </div>
      )}

      <div className={styles.message__inner}>
        <div className={styles.message__inner_top}>
          <img
            className={styles.message__inner_user_foto}
            src="/user_foto/icon.jfif"
            alt="foto user"
          />
          <span className={styles.message__inner_user}>{author}</span>
          <div className={styles.message__top_hour}>
            <DateHourComponent date={date} />
          </div>
        </div>

        {isEditMessage && (
          <FormMessage
            values={values}
            setValues={setValues}
            setIsEditMessage={setIsEditMessage}
            data={data}
          />
        )}

        {!isEditMessage && (
          <div data-id={id} ref={divRef} className={styles.message__inner_text}>
            {message + " " + id}
            {/* {message + " " + id} */}

            {itsMe && (
              <div className={styles.message__text_buttons}>
                <AiTwotoneDelete
                  onClick={() =>
                    controllerMessages.handleDeleteMessage(
                      divRef,
                      setBlockLastUserRef
                    )
                  }
                />
                <MdOutlineModeEdit
                  onClick={() =>
                    controllerMessages.handleEditMessage(
                      divRef,
                      setData,
                      setValues,
                      setIsEditMessage,
                      setBlockLastUserRef
                    )
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
};

export default memo(observer(Message));

// // 2024-12-01T07:23:44.000Z prev date
// // 2024-12-02T07:23:46.000Z today date
// вернути tru якщо різні дні

// INSERT INTO chat_messages (date, message, author, room) VALUES
// ('2024-11-01 07:10:00', 'Good morning everyone! Ready for the new month?', 'Mykola', 'test'),
// ('2024-11-01 08:25:00', 'Morning! Starting the month with a fresh to-do list.', 'Anna', 'test'),
// ('2024-11-01 09:40:00', 'What\'s everyone working on today?', 'Oleg', 'test'),
// ('2024-11-01 10:15:00', 'Finalizing a presentation for tomorrow. You?', 'Ivan', 'test'),
// ('2024-11-02 07:30:00', 'Happy Saturday! Any fun plans for today?', 'Mykola', 'test'),
// ('2024-11-02 08:45:00', 'Thinking of baking something new. Any recipe suggestions?', 'Anna', 'test'),
// ('2024-11-02 09:50:00', 'How about a classic apple pie? Perfect for fall!', 'Oleg', 'test'),
// ('2024-11-02 10:20:00', 'I might try that! Thanks for the idea.', 'Anna', 'test'),
// ('2024-11-03 08:15:00', 'Good morning! How did the baking go, Anna?', 'Mykola', 'test'),
// ('2024-11-03 09:35:00', 'It turned out great! Everyone loved it.', 'Anna', 'test'),
// ('2024-11-03 10:45:00', 'Nice! Let us know what you\'re baking next time.', 'Ivan', 'test'),
// ('2024-11-04 07:50:00', 'Happy Monday! Let\'s have a productive week.', 'Mykola', 'test'),
// ('2024-11-04 08:55:00', 'Morning! What are your goals for this week?', 'Oleg', 'test'),
// ('2024-11-04 09:10:00', 'Finishing up a big project. You?', 'Ivan', 'test'),
// ('2024-11-05 07:35:00', 'Good morning! Meeting today at 2 PM. Ready?', 'Anna', 'test'),
// ('2024-11-05 08:50:00', 'All set. Let\'s review the agenda beforehand.', 'Mykola', 'test'),
// ('2024-11-06 07:20:00', 'Meeting went well yesterday! Great job, team.', 'Oleg', 'test'),
// ('2024-11-06 08:40:00', 'Agreed! Let\'s keep up the momentum.', 'Anna', 'test'),
// ('2024-11-07 07:45:00', 'Anyone up for a movie night this weekend?', 'Mykola', 'test'),
// ('2024-11-07 09:00:00', 'Sounds fun! What should we watch?', 'Ivan', 'test'),
// ('2024-11-08 07:55:00', 'Good morning! Weekend is almost here!', 'Oleg', 'test'),
// ('2024-11-08 09:25:00', 'Morning! Any plans for the weekend?', 'Anna', 'test'),
// ('2024-11-09 07:50:00', 'Good Saturday! Thinking of going for a hike.', 'Mykola', 'test'),
// ('2024-11-09 09:15:00', 'Great idea! Let\'s meet at 10 near the trail.', 'Ivan', 'test'),
// ('2024-11-10 08:20:00', 'The hike was amazing! Thanks for organizing.', 'Anna', 'test'),
// ('2024-11-10 09:30:00', 'Agreed! We should do it again soon.', 'Oleg', 'test'),
// ('2024-11-11 08:45:00', 'Back to work! Any motivational quotes?', 'Mykola', 'test'),
// ('2024-11-11 09:40:00', 'Start where you are. Use what you have. Do what you can.', 'Ivan', 'test'),
// ('2024-11-12 07:25:00', 'Good morning! Team meeting at 3 PM.', 'Anna', 'test'),
// ('2024-11-12 09:15:00', 'Noted! Let\'s review the tasks beforehand.', 'Oleg', 'test'),
// ('2024-11-13 08:05:00', 'Meeting was productive! Let\'s implement the ideas.', 'Mykola', 'test'),
// ('2024-11-14 07:40:00', 'Anyone visiting the new art gallery this week?', 'Ivan', 'test'),
// ('2024-11-14 09:00:00', 'Sounds interesting! Let\'s go together.', 'Anna', 'test'),

// INSERT INTO chat_messages (date, message, author, room) VALUES
// ('2024-11-15 03:15:00', 'Good morning everyone! How\'s your week going?', 'Mykola', 'test'),
// ('2024-11-15 03:18:00', 'Morning! Busy but productive so far. Any plans for the weekend?', 'Anna', 'test'),
// ('2024-11-15 03:25:00', 'Thinking about a short hike. The weather looks great for it.', 'Oleg', 'test'),
// ('2024-11-15 05:45:00', 'Sounds nice! Maybe I\'ll join you. Let\'s decide on a location.', 'Ivan', 'test'),
// ('2024-11-15 08:00:00', 'Good morning! Any updates on the hike?', 'Mykola', 'test'),
// ('2024-11-15 08:10:00', 'Good morning! Happy Friday!', 'Oleg', 'test'),
// ('2024-11-15 09:05:00', 'Yes, how about the Forest Trail near the lake?', 'Anna', 'test'),
// ('2024-11-15 09:20:00', 'Morning! Let\'s wrap up the week strong.', 'Mykola', 'test');
// ('2024-11-15 10:25:00', 'Perfect! Let\'s meet at 9 AM on Saturday.', 'Oleg', 'test'),
// ('2024-11-16 06:00:00', 'I\'ll bring snacks. Who\'s bringing water?', 'Ivan', 'test'),
// ('2024-11-16 08:00:00', 'Morning! Can anyone recommend a good podcast for the drive?', 'Anna', 'test'),
// ('2024-11-16 09:00:00', 'Try "Nature Talks" — it\'s great for outdoor enthusiasts.', 'Mykola', 'test'),
// ('2024-11-16 09:30:00', 'The hike was amazing! Thanks for organizing it.', 'Anna', 'test'),
// ('2024-11-17 06:30:00', 'Agreed! Let\'s do this again soon.', 'Oleg', 'test'),
// ('2024-11-17 06:35:00', 'Good morning! Back to work tomorrow. Any motivational tips?', 'Mykola', 'test'),
// ('2024-11-17 07:05:00', 'Start with your easiest task to build momentum!', 'Ivan', 'test'),
// ('2024-11-17 08:25:00', 'Happy Monday! Let\'s have a productive week.', 'Mykola', 'test'),
// ('2024-11-18 07:00:00', 'Don\'t forget about our meeting tomorrow at 2 PM.', 'Anna', 'test'),
// ('2024-11-18 08:00:00', 'Ready for the meeting? Let\'s finalize the agenda.', 'Oleg', 'test'),
// ('2024-11-18 10:00:00', 'Meeting went well! Great job, team.', 'Mykola', 'test'),
// ('2024-11-19 06:00:00', 'Weekend plans? I\'m thinking of visiting the Christmas market.', 'Anna', 'test'),
// ('2024-11-19 08:00:00', 'I\'ll join you for the market. Let\'s meet at noon.', 'Oleg', 'test');

// INSERT INTO chat_messages (date, message, author, room) VALUES
// ('2024-11-20 08:00:00', 'Dobré ráno všem! Jak vám jde týden?', 'Mykola', 'test'),
// ('2024-11-20 09:00:00', 'Ráno! Zatím je rušno, ale produktivně. Má někdo plány na víkend?', 'Anna', 'test'),
// ('2024-11-20 10:00:00', 'Přemýšlím o krátké túře. Počasí na to vypadá skvěle.', 'Oleg', 'test'),
// ('2024-11-20 11:00:00', 'To zní skvěle! Možná se přidám. Rozhodněme se, kam půjdeme.', 'Ivan', 'test'),
// ('2024-11-21 08:00:00', 'Dobré ráno! Nějaké novinky ohledně túry?', 'Mykola', 'test'),
// ('2024-11-21 09:00:00', 'Ano, co takhle Lesní stezka u jezera?', 'Anna', 'test'),
// ('2024-11-21 10:00:00', 'Perfektní! Setkejme se v sobotu v 9 ráno.', 'Oleg', 'test'),
// ('2024-11-21 11:00:00', 'Přinesu svačinu. Kdo vezme vodu?', 'Ivan', 'test'),
// ('2024-11-22 08:00:00', 'Dobré ráno! Může někdo doporučit dobrý podcast na cestu?', 'Anna', 'test'),
// ('2024-11-22 09:00:00', 'Zkuste "Příroda mluví" — je to skvělé pro milovníky přírody.', 'Mykola', 'test'),
// ('2024-11-23 09:00:00', 'Túra byla úžasná! Díky za organizaci.', 'Anna', 'test'),
// ('2024-11-23 10:00:00', 'Souhlasím! Musíme to brzy zopakovat.', 'Oleg', 'test'),
// ('2024-11-24 08:00:00', 'Dobré ráno! Zítra zase do práce. Nějaké motivační tipy?', 'Mykola', 'test'),
// ('2024-11-24 09:00:00', 'Začněte nejjednodušším úkolem, abyste získali energii!', 'Ivan', 'test'),
// ('2024-11-25 08:00:00', 'Šťastné pondělí! Pojďme mít produktivní týden.', 'Mykola', 'test'),
// ('2024-11-26 09:00:00', 'Nezapomeňte na zítřejší schůzku ve 14:00.', 'Anna', 'test'),
// ('2024-11-27 08:00:00', 'Připraveni na schůzku? Dokončeme program.', 'Oleg', 'test'),
// ('2024-11-28 10:00:00', 'Schůzka proběhla dobře! Skvělá práce, týme.', 'Mykola', 'test'),
// ('2024-11-29 09:00:00', 'Plány na víkend? Přemýšlím o návštěvě vánočního trhu.', 'Anna', 'test'),
// ('2024-11-30 08:00:00', 'Přidám se na trh. Setkejme se v poledne.', 'Oleg', 'test'),
// ('2024-12-01 08:00:00', 'Доброго ранку всім! Які плани на вихідні?', 'Mykola', 'test'),
// ('2024-12-01 09:00:00', 'Привіт! Думаю поїхати на природу, погода обіцяє бути гарною. Хто зі мною?', 'Anna', 'test'),
// ('2024-12-01 10:00:00', 'Це чудова ідея! Я за. Можемо взяти велосипеди і влаштувати пікнік.', 'Oleg', 'test'),
// ('2024-12-01 11:00:00', 'Привіт усім! Я теж долучаюся. Давайте зустрінемося у парку о 10 ранку.', 'Ivan', 'test'),
// ('2024-12-01 12:00:00', 'Я, мабуть, трохи запізнюся, бо маю справи вранці, але обов\'язково приєднаюся.', 'Petro', 'test'),
// ('2024-12-01 13:00:00', 'Всі згодні? Тоді зустрічаємося в парку о 10. Не забудьте взяти бутерброди і воду.', 'Anna', 'test'),
// ('2024-12-02 08:00:00', 'Як вам вчорашня поїздка? Мені сподобалося!', 'Mykola', 'test'),
// ('2024-12-02 09:00:00', 'Було класно! Особливо коли ми знайшли ту маленьку річечку. Треба частіше так збиратися.', 'Michal', 'test'),
// ('2024-12-02 10:00:00', 'Точно. Наступного разу можемо поїхати до озера. Хто за?', 'Oleg', 'test'),
// ('2024-12-02 11:00:00', 'Я тільки за! Іван, ти як?', 'Anna', 'test'),
// ('2024-12-02 12:00:00', 'Звісно, підтримаю ідею. На наступні вихідні домовимося?', 'Ivan', 'test'),
// ('2024-12-02 13:00:00', 'Вже чекаю на наступну поїздку. Сподіваюся, погода буде такою ж чудовою.', 'Petro', 'test'),
// ('2024-12-03 08:00:00', 'Добрий день! Що нового?', 'Oleg', 'test'),
// ('2024-12-03 09:00:00', 'Все добре, готуюся до свята.', 'Anna', 'test'),
// ('2024-12-03 10:00:00', 'Хто які плани має на вихідні?', 'Mykola', 'test'),
// ('2024-12-03 11:00:00', 'Думаю залишитися вдома і подивитися фільм.', 'Ivan', 'test'),
// ('2024-12-03 12:00:00', 'Я хочу зустрітися з друзями.', 'Petro', 'test'),
// ('2024-12-03 13:00:00', 'Можемо організувати невелике зібрання.', 'Michal', 'test'),
// ('2024-12-03 08:00:00', 'Добрий день! Що нового?', 'Oleg', 'test'),
// ('2024-12-03 09:00:00', 'Все добре, готуюся до свята.', 'Anna', 'test'),
// ('2024-12-03 10:00:00', 'Хто які плани має на вихідні?', 'Mykola', 'test'),
// ('2024-12-03 11:00:00', 'Думаю залишитися вдома і подивитися фільм.', 'Ivan', 'test'),
// ('2024-12-03 12:00:00', 'Я хочу зустрітися з друзями.', 'Petro', 'test'),
// ('2024-12-03 13:00:00', 'Можемо організувати невелике зібрання.', 'Michal', 'test'),
// ('2024-12-04 08:00:00', 'Доброго ранку! Як ваш настрій сьогодні?', 'Mykola', 'test'),
// ('2024-12-04 09:00:00', 'Привіт! Настрій чудовий, бо сьогодні планую завершити важливий проєкт.', 'Anna', 'test'),
// ('2024-12-04 10:00:00', 'А в мене день обіцяє бути спокійним. Думаю зробити генеральне прибирання.', 'Oleg', 'test'),
// ('2024-12-04 11:00:00', 'Хтось знає хороший рецепт пирога? Хочу здивувати сім’ю.', 'Ivan', 'test'),
// ('2024-12-04 12:00:00', 'Можу поділитися рецептом шоколадного пирога. Готується швидко і дуже смачно.', 'Petro', 'test'),
// ('2024-12-04 13:00:00', 'Кидай рецепт сюди, цікаво спробувати!', 'Mykola', 'test'),
// ('2024-12-04 14:00:00', 'Ось рецепт: 200 г шоколаду, 200 г масла, 4 яйця, 150 г цукру, 100 г борошна. Все змішати і випікати 25 хвилин.', 'Petro', 'test'),
// ('2024-12-04 15:00:00', 'Дякую, спробую приготувати ввечері!', 'Ivan', 'test'),
// ('2024-12-04 16:00:00', 'До речі, у кого ще які ідеї для вихідних?', 'Oleg', 'test'),
// ('2024-12-04 17:00:00', 'Можна сходити до музею чи галереї. Давно хотів це зробити.', 'Anna', 'test'),
// ('2024-12-05 08:00:00', 'Доброго ранку! Що нового у вас?', 'Mykola', 'test'),
// ('2024-12-05 09:00:00', 'Привіт! Вчора випробував рецепт пирога — сім’ї сподобалося!', 'Ivan', 'test'),
// ('2024-12-05 10:00:00', 'Радий це чути! Мабуть, наступного разу спробую щось інше.', 'Petro', 'test'),
// ('2024-12-05 11:00:00', 'У мене на вихідних змагання. Хто хоче прийти повболівати?', 'Oleg', 'test'),
// ('2024-12-05 12:00:00', 'Де саме будуть змагання? Якщо поблизу, то можу прийти.', 'Anna', 'test'),
// ('2024-12-05 13:00:00', 'В парку біля озера о 14:00. Буду радий бачити всіх!', 'Oleg', 'test'),
// ('2024-12-05 14:00:00', 'Чудово, приєднаюся. Давно не бачилися наживо.', 'Mykola', 'test'),
// ('2024-12-05 15:00:00', 'І я прийду. Можемо після змагань десь випити кави.', 'Ivan', 'test'),
// ('2024-12-05 16:00:00', 'Тоді до зустрічі у парку! Бажаю успіху на змаганнях!', 'Anna', 'test');
