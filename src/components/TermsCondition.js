import React, {useEffect} from "react";
import "../assets/css/termsCondition.css";
import Header from "./header/Header";

function TermsCondition() {
  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);
  return (
    <div className="terms_body" style={{paddingBottom: "1px"}}>
      <div className="container">
        <Header />
        <h1
          style={{
            color: "white",
            fontWeight: "bold",
            textDecoration: "underline",
          }}>
          Terms and Conditions
        </h1>
        {/* <p>General Terms</p> */}

        <h1>1. Introduction</h1>
        <ul>
          <li>
            <p>
              Please read these Terms of Use carefully. By using the Service (as
              defined), you agree that you have read and understood the terms in
              these Terms of Use which are applicable to you. These Terms of Use
              and the Jeremy’s Live Policies (as defined) constitute a legally
              binding agreement (“Agreement”) between you and Jeremy’s Live (as
              defined). The Agreement applies to your use of the Service (as
              defined) provided by Jeremy’s Live. If you do not agree to the
              Terms of Use please do not use or continue using the Application
              or the Service.
            </p>
          </li>
          <li>
            <p>
              Jeremy’s Live may amend the terms in the Agreement at any time.
              Such amendments shall be effective once they are posted on
              http://www.jeremyslive.com or the Application. It is your
              responsibility to review the Terms of Use regularly. Your
              continued use of the Service after any such amendments, whether or
              not reviewed by you, shall constitute your agreement to be bound
              by such amendments.
            </p>
          </li>
          <li>
            <p>
              If you use the Service in a country other than the country where
              you registered for the Application (the “Alternate Country“), you
              must regularly review the Terms of Service applicable in the
              Alternate Country which can be found at
              https://www.jeremyslive.com as it may differ from the country
              where you registered for the Application. By using the Service in
              the Alternate Country, you agree to be bound by prevailing Terms
              of Use in the Alternate Country.
            </p>
          </li>
          <li>
            <p>
              JEREMY’S LIVE IS OWNED BY JEREMY’S LIVE, WORLDWIDE, LLC BASED IN
              RENO, NEVADA USA THAT PROVIDES A PLATFORM FOR USERS TO OBTAIN
              SERVICES PROVIDED BY THIRD PARTY PROVIDERS. JEREMY’S LIVE ROLE IS
              MERELY TO LINK THE USER WITH SUCH THIRD PARTY PROVIDER. JEREMY’S
              LIVE IS NOT RESPONSIBLE FOR THE ACTS AND/OR OMISSIONS OF ANY THIRD
              PARTY PROVIDER, AND ANY LIABILITY IN RELATION TO SUCH SERVICES
              SHALL BE BORNE BY THE THIRD PARTY PROVIDER. THIRD PARTY PROVIDERS
              SHALL NOT REPRESENT TO BE AN AGENT, EMPLOYEE OR STAFF OF JEREMY’S
              LIVE AND THE SOLUTIONS PROVIDED BY THIRD PARTY PROVIDERS SHALL NOT
              BE DEEMED TO BE PROVIDED BY JEREMY’S LIVE.
            </p>
          </li>
        </ul>

        <h2>2. Definitions</h2>
        <p>
          In these Terms of Use, the following words shall have the meanings
          ascribed below:
        </p>
        <ul>
          <li>
            <p>
              “Application” means the relevant mobile application(s) made
              available for download by Jeremy’s Live (or its licensors) to
              Users and Third Party Providers respectively;
            </p>
          </li>
          <li>
            <p>
              “Jeremy’s Live” means: Social E-Commerce 2way Live Streaming
              Network on both Web and Mobile Platform.
            </p>
          </li>
          <li>
            <p>
              “Platform” means the relevant Jeremy’s Live technology platform,
              portal or website that, when used in conjunction with the
              Application, enables Users to request or access Solutions;
            </p>
          </li>
          <li>
            <p>
              “Privacy Policy” means our privacy policy as amended from time to
              time;
            </p>
          </li>
          <li>
            <p>
              “Service” means the linking of Users to Third Party Providers or
              other Users through the Application, Platform and/or Software;
            </p>
          </li>
          <li>
            <p>
              “Software” means any software associated with the Application
              which is supplied made available for download and installation by
              Jeremy’s Live;
            </p>
          </li>
          <li>
            <p>
              “Third Party Provider” means the independent third parties who
              provide the Services:
            </p>
            <ol>
              <li>
                <p>
                  <strong>“Star”</strong> means third party who registered as
                  “Star” under Music category with Jeremy’s Live who provides
                  Music Entertainment to Users.
                </p>
              </li>
              <li>
                <p>
                  <strong>“Chef”</strong> means third party who registered as
                  “Chef” under Food category with Jeremy’s Live who provides
                  foods services from home to Users.
                </p>
              </li>
              <li>
                <p>
                  <strong>“Vendor”</strong> means third party who registered as
                  “Vendor” under Style category with Jeremy’s Live who sells
                  Products to Users.
                </p>
              </li>
              <li>
                <p>
                  <strong>“Trainer”</strong> means third party who registered as
                  “Trainer” under Body category with Jeremy’s Live who offers
                  online body fitness and training to Users.
                </p>
              </li>
            </ol>
          </li>
          <li>
            <p>
              “User” means any person who uses the Application, Platform and/or
              Software to search for and obtain the Services from Third Party.
            </p>
          </li>
          <li>
            <p>
              “User Charges” shall mean charges incurred by Users for the
              Services obtained through the use of the Service, including any
              applicable taxes and any other fees or charges that may be due for
              a particular use of the Service or Solutions.
            </p>
          </li>
        </ul>
        <h1>3. Representations, Warranties and Undertakings</h1>
        <ul>
          <li>
            <p>
              By using the Service, you represent, warrant / undertake that:
            </p>
            <ol>
              <li>
                <p>
                  You are at least twenty (18) years old, or that you have legal
                  capacity to enter into the Agreement;
                </p>
              </li>
              <li>
                <p>
                  All the information which you provide shall be true and
                  accurate;
                </p>
              </li>
              <li>
                <p>
                  You will only use the Application, Platform, Service, and
                  Solutions for their intended and lawful purposes;
                </p>
              </li>
              <li>
                <p>
                  You will keep your account password or any identification we
                  provide you which allows access to the Service secure and
                  confidential;
                </p>
              </li>
              <li>
                <p>
                  You agree to notify us immediately of any unauthorized use of
                  your account or any other breach of security;
                </p>
              </li>
              <li>
                <p>
                  You will not try to interrupt or harm the Service, Application
                  and/or the Software in any way;
                </p>
              </li>
              <li>
                <p>
                  You will not attempt to commercially exploit any part of the
                  Application without our permission, including without
                  limitation modify any of the Application’s content in any way,
                  or copy, reproduce, publicly display, distribute or otherwise
                  use or communicate them for any public or commercial purpose
                  without our permission;
                </p>
              </li>
              <li>
                <p>
                  You will not authorize others to use your identity or user
                  status, and you may not assign or otherwise transfer your user
                  account to any other person or entity;
                </p>
              </li>
              <li>
                <p>
                  You will provide us with whatever proof of identity or any
                  other documents, permits, licenses or approvals which we may
                  reasonably request or require;
                </p>
              </li>
              <li>
                <p>
                  You will not use the Application for sending or storing any
                  unlawful material or for fraudulent purposes;
                </p>
              </li>
              <li>
                <p>
                  You will not use the Application and/or the Software to cause
                  nuisance or behave in an inappropriate or disrespectful manner
                  towards Jeremy’s Live or any third party;
                </p>
              </li>
              <li>
                <p>
                  When using the Service and Solutions, you agree to comply with
                  all laws applicable to you and/or your use of the Service and
                  Solutions;
                </p>
              </li>
              <li>
                <p>
                  You will not copy, or distribute the Software or other content
                  without written permission from Jeremy’s Live;
                </p>
              </li>
              <li>
                <p>
                  You will provide accurate, current and complete information as
                  required for the Service and undertake the responsibility to
                  maintain and update your information in a timely manner to
                  keep it accurate, current and complete at all times during the
                  term of the Agreement. You agree that Jeremy’s Live may rely
                  on your information as accurate, current and complete. You
                  acknowledge that if your information is untrue, inaccurate,
                  not current or incomplete in any respect, Jeremy’s Live has
                  the right but not the obligation to terminate this Agreement
                  and your use of the Service at any time with or without
                  notice;
                </p>
              </li>
              <li>
                <p>
                  You will only use an access point or data account which you
                  are authorized to use;
                </p>
              </li>
              <li>
                <p>
                  You agree that the Service is provided on a reasonable effort
                  basis;
                </p>
              </li>
              <li>
                <p>
                  You agree that your use of the Service will be subject to
                  Jeremy’s Live Privacy Policy as may be amended from time to
                  time;
                </p>
              </li>
              <li>
                <p>
                  You agree to assist Jeremy’s Live with any internal or
                  external investigations as may be required by Jeremy’s Live in
                  complying with any prevailing laws or regulations in place;
                </p>
              </li>
              <li>
                <p>
                  You agree to assume full responsibility and liability for all
                  loss or damage suffered by yourself, Jeremy’s Live or any
                  other party as a result of your breach of this Agreement.
                </p>
              </li>
              <li>
                <p>
                  You will not utilize modified devices or applications with the
                  intent of evading detections or facilitating any activities
                  intended to defraud Jeremy’s Live or to disrupt the natural
                  functions of the Application; and
                </p>
              </li>
              <li>
                <p>
                  You provide us the phone numbers of Jeremy’s Live users and
                  other contacts in your mobile phone address book on a regular
                  basis. You confirm that you are authorized to provide us with
                  such numbers to enhance your use of the Service.
                </p>
              </li>
            </ol>
          </li>
          <li>
            <p>
              If you are a <strong>Third Party Provider</strong>, you further
              represent, warrant / undertake that:
            </p>
            <ol>
              <li>
                <p>
                  You shall be solely responsible for any and all claims,
                  judgments and liabilities resulting from any accident, loss or
                  damage including, but not limited to, personal injuries,
                  death, total loss and property damage which is due to or is
                  alleged to be a result of the services provided by you;
                </p>
              </li>
              <li>
                <p>
                  You shall obey all local laws related to the services and will
                  be solely responsible for any violations of such local laws;
                </p>
              </li>
              <li>
                <p>
                  You shall not contact Users for purposes other than in
                  connection with the Service and Solutions;
                </p>
              </li>
              <li>
                <p>
                  You shall not reverse look-up, trace or seek to trace any
                  information on any other user of or visitor to the
                  Application, or any other customer of Jeremy’s Live, including
                  without limitation any user account not owned by you, to its
                  source, or exploit the Application or any service or
                  information made available or offered by or through the
                  Application, in any way where the purpose is to reveal any
                  information, including but shall not be limited to personal
                  identification information, other than your own information,
                  as provided for by the Application;
                </p>
              </li>
            </ol>
          </li>
          <li>
            <p>
              If you are a <strong>User</strong>, you further represent, warrant
              / undertake that
            </p>
            <ol>
              <li>
                <p>
                  Your use of the Service is for your own sole, personal use or,
                  where permitted, for the use of another person who is under
                  twelve (12) years old (“Minor”), in which case you shall
                  assume primary responsibility of the Minor; You will not use
                  the Application, Platform and/or the Software to cause
                  nuisance, annoyance, inconvenience or make fake services;
                </p>
              </li>
              <li>
                <p>
                  You are respectfully reminded that unauthorized recording,
                  duplication, and/or distribution of any live streaming or any
                  part thereof to any media is illegal and will result in civil
                  liability and criminal prosecution.
                </p>
              </li>
              <li>
                <p>
                  acknowledge and agree that only one (1) account can be
                  registered on one device;
                </p>
              </li>
              <li>
                <p>
                  You agree that Jeremy’s Live may, based on its sole
                  discretion, consider an account to be dormant if there has
                  been no access made by you on your user account for a period
                  of six (6) months from the last date of access and deactivate
                  or restrict access to your user account.
                </p>
              </li>
            </ol>
          </li>
        </ul>

        <h1>4. Compatibility</h1>
        <ul>
          <li>
            <p>
              Different models or versions of routers, browsers and devices may
              have firmware or settings that are not compatible with the
              Application, Platform and/or Software. While we continuously
              develop the Application, Platform and/or Software in order to, as
              far as possible, support all commonly used devices and models in
              markets and all browsers where the Application, Platform and/or
              Software is likely to be accessed from, we do not warrant
              compatibility of the Application, Platform and/or Software with
              specific mobile devices or other hardware.
            </p>
          </li>
        </ul>

        <h1>5. License Grant and Restrictions</h1>
        <ul>
          <li>
            <p>
              Jeremy’s Live and its licensors, where applicable, grant you a
              revocable, non-exclusive, non- transferable, limited license to
              use and access the Application and/or the Software to use the
              Service, subject to the terms and conditions of this Agreement.
              All rights not expressly granted to you are reserved by Jeremy’s
              Live and its licensors.
            </p>
          </li>
          <li>
            <p>You shall not:</p>
          </li>
          <ol>
            <li>
              <p>
                License, sublicense, sell, transfer, assign, distribute or
                otherwise commercially exploit or make available to any third
                party the Application and/or the Software in any way;
              </p>
            </li>
            <li>
              <p>
                Modify or make derivative works based on the Application and/or
                the Software;
              </p>
            </li>
            <li>
              <p>
                “mirror” the Application / Software on any other server or
                wireless or internet-based device;
              </p>
            </li>
            <li>
              <p>
                Except to the extent such restriction is prohibited under
                applicable law, disassemble, decompile, reverse engineer,
                decrypt or attempt to derive and code or extract software from,
                the Application or any software or services made available on or
                through the Application;
              </p>
            </li>
            <li>
              <p>
                Use any manual or automated program or script, including but not
                limited to web spiders, web crawlers, web robots, web ants, web
                indexers, bots, viruses or worms, or any program which may make
                multiple server requests per second, (a) to unduly burden or
                hinder the operation and/or performance of the Application; (b)
                to conduct data mining or scraping activities, or (b) in any way
                reproduce or circumvent the navigational structure or
                presentation of the Application or its content;
              </p>
            </li>
            <li>
              <p>
                Post, distribute or reproduce in any way any copyrighted
                material, trademarks, or other proprietary information without
                obtaining the prior consent of the owner of such proprietary
                rights
              </p>
            </li>
            <li>
              <p>
                Remove any copyright, trademark or other proprietary rights
                notices contained on the Application or Platform; or
              </p>
            </li>
            <li>
              <p>
                Use the Application to: (a) send spam or otherwise duplicative
                or unsolicited messages; (b) send or store infringing, obscene,
                threatening, libelous, or otherwise unlawful or tortious
                material, including but not limited to materials harmful to
                children or violative of third party privacy rights; (c) send
                material containing software viruses, worms, trojan horses or
                other harmful computer code, files, scripts, agents or programs;
                (d) interfere with or disrupt the integrity or performance of
                the Application or the data contained therein; (e) attempt to
                gain unauthorized access to the Application or its related
                software, systems or networks; (f) impersonate any person or
                entity or otherwise misrepresent your affiliation with a person
                or entity; or (g) engage in any conduct that could possibly
                damage our reputation or amount to being disreputable.
              </p>
            </li>
          </ol>
        </ul>

        <h1>6. Payments</h1>
        <ul>
          <li>
            <p>For Third Party Providers:</p>
            <ol>
              <li>
                <p>
                  The fees which you pay Jeremy’s Live for the Service are due
                  immediately and are non-refundable (“Service Fee“). Subject to
                  any limit stipulated by the applicable law, the Service Fee
                  shall be a 30% of the User Charges, as determined by Jeremy’s
                  Live from time to time. This no-refund policy shall apply at
                  all times regardless of your decision to terminate your access
                  to the Application / Platform, our decision to terminate or
                  suspend your access to the Application / Platform, disruption
                  caused to the Service whether planned, accidental or
                  intentional, or any reason whatsoever.
                </p>
              </li>
              <li>
                <p>
                  You acknowledge that the total amount of User Charges paid to
                  you by Users includes the Service Fee, which you collect on
                  behalf of Jeremy’s Live.
                </p>
              </li>
              <li>
                <p>
                  Jeremy’s Live may, at its sole discretion, make promotional
                  offers with different features and different rates on the
                  Solutions to any of the Users whereby these promotional offers
                  shall accordingly be honored by you. Jeremy’s Live may change
                  the Service Fee at any time at its sole discretion.
                </p>
              </li>
              <li>
                <p>
                  Users may pay for you such as by credit or debit card
                  (“Card”). All payments due to you for your services, including
                  tips (where applicable), will be channeled to you within 3-5
                  days from the date of payment made by the Users through your
                  registered Paypal Account on Jeremy's Live.
                </p>
              </li>
              <li>
                <p>
                  Jeremy’s Live retains the right to suspend the processing of
                  any transaction where it reasonably believes that the
                  transaction may be fraudulent, illegal or involves any
                  criminal activity or where you and/or the User breached any
                  term in this Agreement. In such an event, you shall not hold
                  Jeremy’s Live liable for any withholding of, delay in,
                  suspension, forfeiture or cancellation of, any payment to you.
                </p>
              </li>
            </ol>
          </li>
          <li>
            <p>For Users:</p>
            <ol>
              <li>
                <p>
                  Once you have completed using the Service, you are required to
                  make payment in full to the Third Party Provider by selecting
                  of the payment methods available to you on the Application.
                  Any payment pursuant to such selection will be automatic and
                  is non-refundable.
                </p>
              </li>
              <li>
                <p>
                  You may choose to pay the Third Party Provider by Paypal, and
                  by credit or debit card (“Card”), where available.
                </p>
              </li>
              <li>
                <p>
                  If you choose to make payment by Card, you will need to
                  register a valid Card which belongs to you in accordance with
                  the instructions in the Application.
                </p>
              </li>
              <li>
                <p>
                  You agree that Jeremy’s Live may verify and authorize your
                  Card details when you first register the Card with us as well
                  as when you use the Service.
                </p>
              </li>
              <li>
                In the event your payment by your Card is processed overseas,
                you will be liable for any additional charges in relation
                thereto.
              </li>
              <li>
                <p>
                  Jeremy’s Live may suspend the processing of any transaction or
                  disable or limit the use of the Card in the event of any error
                  in transaction which results in decline or chargeback from the
                  financial institution or where Jeremy’s Live reasonably
                  believes that the Card has been used for a transaction that
                  may be fraudulent, illegal or involves any criminal activity
                  or where Jeremy’s Live reasonably believes you to be in breach
                  of this Agreement.
                </p>
              </li>
              <li>
                <p>
                  You agree that you will cooperate in relation to any financial
                  crime screening that is required and to assist Jeremy’s Live
                  in complying with any prevailing laws or regulations in place.
                </p>
              </li>
              <li>
                <p>
                  You shall be responsible to resolve any disputes with your
                  Card company on your own.
                </p>
              </li>
            </ol>
          </li>
        </ul>

        <h1>7. Ratings</h1>
        <ul>
          <li>
            <p>
              Users and Third Party Providers may be allowed to rate each other
              in respect of Services provided.
            </p>
          </li>
          <li>
            <p>
              Every rating will be automatically logged onto Jeremy’s Live
              system and Jeremy’s Live may analyze all ratings received.
              Jeremy’s Live may take all appropriate actions including
              suspending your use of the Service without any notice or
              compensation to you.
            </p>
          </li>
        </ul>

        <h1>8. Complaints</h1>
        <ul>
          <li>
            <p>
              Any complaints between Third Party Providers and Users must be
              taken up with each other directly.
            </p>
          </li>
        </ul>

        <h1>9. Intellectual Property Ownership</h1>
        <ul>
          <li>
            <p>
              Jeremy’s Live and its licensors, where applicable, shall own all
              right, title and interest, including all related intellectual
              property rights, in and to the Software and/or the Application and
              by extension, the Service and any suggestions, ideas, enhancement
              requests, feedback, recommendations or other information provided
              by you or any other party relating to the Service. The Terms of
              Use do not constitute a sale agreement and do not convey to you
              any rights of ownership in or related to the Service, the Software
              and/or the Application, or any intellectual property rights owned
              by Jeremy’s Live and/or its licensors. Jeremy’s Live name,
              Jeremy’s Live logo, the Service, the Software and/or the
              Application and the third party transportation providers’ logos
              and the product names associated with the Software and/or the
              Application are trademarks of Jeremy’s Live or third parties, and
              no right or license is granted to use them. For the avoidance of
              doubt, the term the Software and the Application herein shall
              include its respective components, processes and design in its
              entirety.
            </p>
          </li>
        </ul>

        <h1>10. Taxes</h1>
        <ul>
          <li>
            <p>
              You agree that this Agreement is subject to all prevailing
              statutory taxes, duties, fees, charges and/or costs, however
              denominated, as may be applicable from time to time. You shall
              comply with all applicable laws and take all steps required to
              enable, assist and/or defend Jeremy’s Live to claim or verify any
              input tax credit, set off, rebate or refund in respect of any
              taxes paid or payable in connection with the Service.
            </p>
          </li>
          <li>
            <p>
              If you are a Third Party Provider, you are accountable for paying
              any tax and statutory contributions due in respect of sums payable
              to you under or in connection with this Agreement.
            </p>
          </li>
        </ul>

        <h1>11. Confidentiality</h1>
        <ul>
          <li>
            <p>
              You shall maintain in confidence all information and data relating
              to Jeremy’s Live, its services, products, business affairs,
              marketing and promotion plans or other operations and its
              associated companies which are disclosed to you by or on behalf of
              Jeremy’s Live (whether orally or in writing and whether before, on
              or after the date of this Agreement) or which are otherwise
              directly or indirectly acquired by you from Jeremy’s Live, or any
              of its affiliate companies, or created in the course of this
              Agreement. You shall further ensure that you only use such
              confidential information in order to use the Service, and shall
              not without Jeremy’s Live prior written consent, disclose such
              information to any third party nor use it for any other purpose.
            </p>
          </li>
          <li>
            <p>
              The above obligations of confidentiality shall not apply to the
              extent that you can show that the relevant information:
            </p>
            <ol>
              <li>
                <p>was at the time of receipt already in your possession;</p>
              </li>
              <li>
                <p>
                  is, or becomes in the future, public knowledge through no
                  fault or omission on your part;
                </p>
              </li>
              <li>
                <p>
                  was received from a third party having the right to disclose
                  it; or
                </p>
              </li>
              <li>
                <p>is required to be disclosed by law.</p>
              </li>
            </ol>
          </li>
        </ul>

        <h1>12. Data Privacy and Privacy Policy</h1>
        <ul>
          <li>
            <p>
              Jeremy’s Live collects, processes, and disclose your Personal Data
              in accordance with its Privacy Policy on the website
              (“jeremyslive.com’). The Privacy Policy applies all of Jeremy’s
              Live Services and its terms are made a part of this Agreement by
              this reference.
            </p>
          </li>
          <li>
            <p>
              Where applicable, you agree and consent to Jeremy’s Live, its
              subsidiaries and any of its affiliate companies collecting, using,
              processing and disclosing Personal Data as further described in
              our Privacy Policy.
            </p>
          </li>
          <li>
            <p>
              You acknowledge that Jeremy’s Live may disclose Personal Data of
              other individuals to you in the course of your use of Jeremy’s
              Live Services. You represent and warrant that you will only use
              such Personal Data for the purpose for which it was disclosed to
              you by Jeremy’s Live, and not for any other unauthorized purposes.
            </p>
          </li>
        </ul>

        <h1>13. Third Party Interactions</h1>
        <ul>
          <li>
            <p>
              During use of the Service, you may enter into correspondence or
              transactions with third parties who display or offer their goods
              and/or service through the Platform or Application. Any such
              communication or agreement is strictly between you and the
              applicable third party and Jeremy’s Live and its licensors shall
              have no liability or obligation for any such communication or
              agreement. Neither Jeremy’s Live nor any of its affiliate
              companies endorses any applications or sites on the Internet that
              are linked through the Platform or Application, and in no event
              shall Jeremy’s Live, its licensors or its affiliate companies be
              responsible for any content, products, services or other materials
              on or available from such sites or third party providers. Certain
              third party providers of transportation, goods and/or services may
              require your agreement to additional or different Terms of Use and
              privacy policies prior to your use of or access to such goods or
              services, and Jeremy’s Live is not a party to and disclaims any
              and all responsibility and/or liability arising from such
              agreements between you and the third party providers. You
              acknowledge that such additional or different Terms of Use and
              privacy policies may apply to your use of such third party
              services. Jeremy’s Live is not liable for any information that you
              provide to or authorize us to provide to a third party, or for
              such third party’s collection, use and disclosure of such
              information.
            </p>
          </li>
          <li>
            <p>
              Jeremy’s Live may rely on third party advertising and marketing
              supplied through the Service and other mechanisms to subsidize the
              Service and/or to earn additional revenue.
            </p>
          </li>
          <li>
            <p>
              You agree and allow Jeremy’s Live to compile and release
              information regarding you and your use of the Service on an
              anonymous basis as part of a customer profile or similar report or
              analysis. You agree that it is your responsibility to take all
              precautions in all actions and interactions with any third party
              you interact with through the Service and/or advertising or
              marketing material supplied by third parties through the Service.
            </p>
          </li>
          <li>
            <p>
              We may include hyperlinks to other websites or content on the
              Internet that are owned or operated by third parties (“Third Party
              Links“). Such Third Party Links are not under our control and we
              are not liable for any errors, omissions, delays, defamation,
              libel, slander, falsehood, obscenity, pornography, profanity,
              inaccuracy or any other objectionable material contained in the
              content, or the consequences of accessing, any linked website. Any
              hyperlinks to any other websites or content are not an endorsement
              or verification of such websites or content and you agree that
              your access to or use of such linked websites or content is
              entirely at your own risk.
            </p>
          </li>
          <li>
            <p>
              You acknowledge that in addition to utilizing data from the Data
              Sources listed in Section B the Application utilizes and modifies
              search results from Google Maps services and content, and that by
              using the Application, you agree to comply with (1) the Google
              Maps/ Google Earth Additional Terms of Services at{" "}
              <a
                href="https://maps.google.com/help/terms_maps.html"
                style={{color: "red", textDecoration: "underline"}}>
                https://maps.google.com/help/terms_maps.html
              </a>
              (2) the Google Privacy Policy at{" "}
              <a
                href="https://www.google.com/policies/privacy/"
                style={{color: "red", textDecoration: "underline"}}>
                https://www.google.com/policies/privacy/
              </a>
              and (3) the Google Acceptable Use Policy at{" "}
              <a
                href="https://cloud.google.com/maps-platform/terms/aup/"
                style={{color: "red", textDecoration: "underline"}}>
                https://cloud.google.com/maps-platform/terms/aup/
              </a>
              You further agree that when using the Application you shall not
            </p>
            <ol type="a">
              <li>
                <p>
                  copy, modify, create a derivative work of, reverse engineer,
                  decompile, translate, disassemble or otherwise attempt to
                  extract any of the source code of Google Maps;
                </p>
              </li>
              <li>
                <p>sub-license, transfer or distribute Google Maps;</p>
              </li>
              <li>
                <p>
                  sell, resell or otherwise make Google Map available to a third
                  party as part of a commercial offering that does not have
                  material value independent of Google Maps; or
                </p>
              </li>
              <li>
                access or use Google Maps in a manner that is illegal or which
                is likely to result in a circumvention of any fees payable to
                Google.
              </li>
            </ol>
          </li>
        </ul>

        <h1>14. Indemnification</h1>
        <ul>
          <li>
            <p>
              By agreeing to the Terms of Use upon using the Service, you agree
              that you shall indemnify and hold Jeremy’s Live, its licensors and
              each such party’s affiliates, officers, directors, members,
              employees, attorneys and agents harmless from and against any and
              all claims, costs, damages, losses, liabilities and expenses
              (including attorneys’ fees and costs and/or regulatory action)
              arising out of or in connection with: (a) your use of the Service,
              the Platform, Software and/or the Application in your dealings
              with the Third Party Providers or Users (as the case may be),
              third party merchants, providers, partners, advertisers and/or
              sponsors, or (b) your violation or breach of any of the Terms of
              Use or any applicable law or regulation, whether or not referenced
              herein, or (c) your violation of any rights of any third party,
              including Third Party Providers or Users arranged via the Service,
              or (d) your use or misuse of the Service, the Platform, Software
              and/or the Application; (e) where applicable your ownership, use
              or operation of any Vehicle, including your provision of Solutions
              to Users via the Service where applicable.
            </p>
          </li>
        </ul>

        <h1>15. Disclaimer of Warranties</h1>
        <ul>
          <li>
            <p>
              Jeremy’s Live makes no representation, warranty or guarantee as to
              the reliability, timeliness, quality, suitability, availability,
              accuracy or completeness of the Service, Software, Application or
              Platform. Jeremy’s Live does not represent or warrant that (a) the
              use of the Service, Software, Application or Platform will be
              secure, uninterrupted, free of errors or other harmful components,
              or operate in combination with any other hardware, software,
              system or data, (b) will meet your requirements or expectations,
              (c) any stored data will be accurate or reliable, (d) the quality
              of any products, services, information or other materials
              purchased or obtained by you through the Application will meet
              your requirements or expectations. The Service is provided to you
              strictly on an “as is” basis. All conditions, representations and
              warranties, including any implied warranty of merchantability,
              fitness for a particular purpose, or non-infringement of third
              party rights, are hereby excluded to the extent permissible by
              law.
            </p>
          </li>
          <li>
            <p>
              Jeremy’s Live makes no representation or warranty of any kind
              whatsoever, express or implied, in respect of Solutions provided
              by Third Party Providers or any Solutions procured through the use
              of the Service. You agree that you shall bear all risk arising out
              of your use of the Service and any Solution provided by Third
              Party Providers and shall have no recourse to Jeremy’s Live in
              respect of the same.
            </p>
          </li>
        </ul>

        <h1>16. Internet Delays</h1>
        <ul>
          <li>
            <p>
              THE SERVICE, PLATFORM, APPLICATION AND/OR THE SOFTWARE MAY BE
              SUBJECT TO LIMITATIONS, DELAYS, AND OTHER PROBLEMS INHERENT IN THE
              USE OF THE INTERNET AND ELECTRONIC COMMUNICATIONS INCLUDING THE
              DEVICE USED BY YOU OR THE THIRD PARTY PROVIDER BEING FAULTY, NOT
              CONNECTED, OUT OF RANGE, SWITCHED OFF OR NOT FUNCTIONING. JEREMY’S
              LIVE IS NOT RESPONSIBLE FOR ANY DELAYS, DELIVERY FAILURES, DAMAGES
              OR LOSSES RESULTING FROM SUCH PROBLEMS.
            </p>
          </li>
        </ul>

        <h1>17. Limitation of Liability</h1>
        <ul>
          <li>
            <p>
              UNLESS OTHERWISE STATED, AND TO THE FULLEST EXTENT ALLOWED BY LAW,
              ANY CLAIMS AGAINST JEREMY’S LIVE BY YOU SHALL BE LIMITED TO THE
              AGGREGATE AMOUNT OF ALL AMOUNTS ACTUALLY PAID BY AND/OR DUE FROM
              YOU IN UTILIZING THE SERVICE DURING THE EVENT GIVING RISE TO SUCH
              CLAIMS. JEREMY’S LIVE AND/OR ITS LICENSORS SHALL NOT BE LIABLE TO
              YOU OR ANYONE FOR). JEREMY’S LIVE AND/OR ITS LICENSORS SHALL NOT
              BE LIABLE FOR ANY LOSS, DAMAGE OR INJURY WHICH MAY BE INCURRED BY
              OR CAUSED TO YOU OR TO ANY PERSON FOR WHOM YOU HAVE BOOKED THE
              SERVICE, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ol>
              <li>
                <p>
                  LOSS, DAMAGE OR INJURY ARISING OUT OF, OR IN ANY WAY CONNECTED
                  WITH THE SERVICE, THE PLATFORM, APPLICATION AND/OR THE
                  SOFTWARE;
                </p>
              </li>
              <li>
                <p>
                  THE USE OR INABILITY TO USE THE SERVICE, THE PLATFORM,
                  APPLICATION AND/OR THE SOFTWARE;
                </p>
              </li>
              <li>
                <p>
                  ANY RELIANCE PLACED BY YOU ON THE COMPLETENESS, ACCURACY OR
                  EXISTENCE OF ANY ADVERTISING;OR
                </p>
              </li>
              <li>
                <p>
                  AS A RESULT OF ANY RELATIONSHIP OR TRANSACTION BETWEEN YOU AND
                  ANY THIRD PARTY PROVIDER, MERCHANT, ADVERTISER OR SPONSOR
                  WHOSE ADVERTISING APPEARS ON THE WEBSITE OR IS REFERRED TO BY
                  THE SERVICE, THE APPLICATION AND/OR THE SOFTWARE,
                </p>
                <p>
                  EVEN IF JEREMY’S LIVE AND/OR ITS LICENSORS HAVE BEEN
                  PREVIOUSLY ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>
              </li>
            </ol>
          </li>
        </ul>
        <ul>
          <li>
            <p>
              JEREMY’S LIVE DOES NOT AND WILL NOT ASSESS NOR MONITOR THE
              SUITABILITY, LEGALITY, ABILITY, MOVEMENT OR LOCATION OF ANY THIRD
              PARTY PROVIDERS INCLUDING THIRD PARTY TRANSPORTATION PROVIDERS,
              MERCHANTS, ADVERTISERS AND/OR SPONSORS AND YOU EXPRESSLY WAIVE AND
              RELEASE JEREMY’S LIVE FROM ANY AND ALL LIABILITY, CLAIMS OR
              DAMAGES ARISING FROM OR IN ANY WAY RELATED TO THE THIRD PARTY
              PROVIDERS INCLUDING THIRD PARTY TRANSPORTATION PROVIDERS,
              MERCHANTS, ADVERTISERS AND/OR SPONSORS.
            </p>
          </li>
          <li>
            <p>
              JEREMY’S LIVE WILL NOT BE A PARTY TO DISPUTES, OR NEGOTIATIONS OF
              DISPUTES BETWEEN YOU AND USERS THIRD PARTY PROVIDERS INCLUDING
              THIRD PARTY TRANSPORTATION PROVIDERS, MERCHANTS, ADVERTISERS
              AND/OR SPONSORS. UNLESS YOU ARE A CORPORATE CUSTOMER WITH A
              CURRENT CORPORATE ACCOUNT WITH JEREMY’S LIVE, JEREMY’S LIVE CANNOT
              AND WILL NOT PLAY ANY ROLE IN MANAGING PAYMENTS BETWEEN YOU AND
              THE THIRD PARTY PROVIDERS, INCLUDING THIRD PARTY TRANSPORTATION
              PROVIDERS, MERCHANTS, ADVERTISERS AND/OR SPONSORS. RESPONSIBILITY
              FOR THE DECISIONS YOU MAKE REGARDING SERVICES AND PRODUCTS OFFERED
              VIA THE SERVICE, THE SOFTWARE AND/OR THE APPLICATION (WITH ALL ITS
              IMPLICATIONS) RESTS SOLELY WITH AND ON YOU. YOU EXPRESSLY WAIVE
              AND RELEASE JEREMY’S LIVE FROM ANY AND ALL LIABILITY, CLAIMS,
              CAUSES OF ACTION, OR DAMAGES ARISING FROM YOUR USE OF THE SERVICE,
              THE SOFTWARE AND/OR THE APPLICATION, OR IN ANY WAY RELATED TO THE
              THIRD PARTIES INCLUDING THIRD PARTY TRANSPORTATION PROVIDERS,
              MERCHANTS, ADVERTISERS AND/OR SPONSORS INTRODUCED TO YOU BY THE
              SERVICE, THE SOFTWARE AND/OR THE APPLICATION.
            </p>
          </li>
          <li>
            <p>
              THE QUALITY OF THE SOLUTIONS SCHEDULED THROUGH THE USE OF THE
              SERVICE IS ENTIRELY THE RESPONSIBILITY OF THE THIRD PARTY PROVIDER
              WHO ULTIMATELY PROVIDES SUCH SOLUTION TO YOU. YOU UNDERSTAND,
              THEREFORE, THAT BY USING THE SERVICE, YOU MAY BE EXPOSED TO
              TRANSPORTATION THAT IS POTENTIALLY DANGEROUS, OFFENSIVE, HARMFUL
              TO MINORS, UNSAFE OR OTHERWISE OBJECTIONABLE, AND THAT YOU USE THE
              SERVICE AT YOUR OWN RISK.
            </p>
          </li>
        </ul>

        <h1>18. Notice</h1>
        <ul>
          <li>
            <p>
              Jeremy’s Live may give notice through the Application, electronic
              mail to your email address in the records of Jeremy’s Live, or by
              written communication sent by registered mail or pre-paid post to
              your address in the record of Jeremy’s Live. Such notice shall be
              deemed to have been given upon the expiration of 48 hours after
              mailing or posting (if sent by registered mail or pre-paid post)
              or 1 hour after sending (if sent by email). You may give notice to
              Jeremy’s Live (such notice shall be deemed given when received by
              Jeremy’s Live) by letter sent by courier or registered mail to
              Jeremy’s Live using the contact details as provided in the
              Application.
            </p>
          </li>
        </ul>

        <h1>19. Assignment</h1>
        <ul>
          <li>
            <p>
              This Terms of Use as modified from time to time may not be
              assigned by you without the prior written approval of Jeremy’s
              Live but may be assigned without your consent by Jeremy’s Live.
              Any purported assignment by you in violation of this section shall
              be void.
            </p>
          </li>
        </ul>

        <h1>20. Relationship</h1>
        <ul>
          <li>
            <p>
              Nothing contained in these Terms of Use shall be construed as
              creating any agency, partnership, or other form of joint
              enterprise with Jeremy’s Live.
            </p>
          </li>
        </ul>

        <h1>21. Severability</h1>
        <ul>
          <li>
            <p>
              If any provision of the Terms of Use is held to be invalid or
              unenforceable, the legality, validity and enforceability of the
              remaining provisions shall not be affected or impaired.
            </p>
          </li>
        </ul>

        <h1>22. No Waiver</h1>
        <ul>
          <li>
            <p>
              The failure of Jeremy’s Live to enforce any right or provision in
              the Terms of Use shall not constitute a waiver of such right or
              provision.
            </p>
          </li>
        </ul>

        <h1>23. Entire Agreement</h1>
        <ul>
          <li>
            <p>
              This Agreement comprises the entire agreement between you and
              Jeremy’s Live and supersedes any prior or contemporaneous
              negotiations or discussions.
            </p>
          </li>
        </ul>

        <h1>24. Suspension and Termination</h1>
        <ul>
          <li>
            <p>
              You agree that we may do any of the following, at any time,
              without notice: (i) to modify, suspend or terminate operation of
              or access to the Application, or any portion of the Application
              (including access to your Account and/or the availability of any
              products or services), for any reason; (ii) to modify or change
              any applicable policies or terms; and (ii) to interrupt the
              operation of the Application or any portion of the Application
              (including access to your Account and/or the availability of any
              products or services), as necessary to perform routine or
              non-routine maintenance, error correction, or other changes. You
              and Jeremy’s Live expressly waive the provisions of Article 1266
              of the Civil Code as far as necessary to terminate this Agreement
              without prior court decision.
            </p>
          </li>
        </ul>

        <h1>25. No Third Party Rights</h1>
        <ul>
          <li>
            <p>
              This agreement does not give rights to any third parties who are
              not party to this Agreement.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default TermsCondition;
