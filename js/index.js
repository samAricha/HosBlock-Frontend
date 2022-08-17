if (window.location.pathname === '/auth.html') {
  // Check if wallet is linked
  if (isLoggedIn()) {
    window.location.href = '/index.html';
  } else {
    // Access login button DOM element
    const loginBtn = document.querySelector('#login-btn');
    loginBtn.onclick = (event) => {
      login();
    };
  }
} else if (
  window.location.pathname === '/new.html'
) {
  // Check if logged in
  if (!isLoggedIn()) {
    window.location.href = '/auth.html';
  }

  const newReordForm = document.querySelector('#new-record');
  // Adds submitted task
  newRecordForm.onsubmit = async (event) => {
    event.preventDefault();
    const diagnosis = event.target.diagnosis.value;
    const hospital_name = event.target.hospital_name.value;
    const medicine_administered = event.target.medicine_administered.value;
    const date_of_admission = event.target.date_of_admission.value;
    const date_of_release = event.target.date_of_release.value;
    const allergies_recorded = event.target.allergies_recorded.value;
    const price = event.target.price.value;
    
    const addedRecord = await addRecord(
      diagnosis,
      hospital_name, 
      medicine_administered,
      date_of_admission,
      date_of_release, 
      allergies_recorded, 
      Number.parseFloat(price)
    );

    if (addedRecord != null) {
      window.location.href = '/index.html';
    }
    newRecordForm.reset();
  };

} else if (
  window.location.pathname === '/index.html' ||
  window.location.pathname === '/'
) {
  if (!isLoggedIn()) {
    window.location.href = '/auth.html';
  }
  document.querySelector('#wallet-id').textContent = getAccount();

  const logoutBtn = document.querySelector('#logout');

  /**
   * =====================================================
   * Smart Contract Calls
   * =====================================================
   */

  // Logout User
  logoutBtn.onclick = () => {
    logout();
    window.location.reload();
  };


  // Displays Records
  displayRecords();
}

async function displayRecords() {
  // Retreive some records from records
  const records = await readRecords(0, 50);
  let retrievedRecords = '';

  // Loop through the list of tasks if any and wrap them in relevant HTML elemnts
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    retrievedRecords += recordElement(i, record);
  }

  // Reflect the change in DOM
  updateRecords(retrievedRecords);
}

function recordElement(id, {diagnosis, hospital_name, medicine_administered, date_of_admission,
  date_of_release, allergies_recorded, price}) {
  return `<tr class="fw-normal">
                      <th>
                        <img
                          src="../images/hosBlock.png"
                          alt="Toyota"
                          style="width: 45px; height: auto"
                        />
                        <span class="ms-2">${diagnosis}</span>
                      </th>
                      <td class="align-middle">
                        <span>${hospital_name}</span>
                      </td>
                      <td class="align-middle">
                        <span>${medicine_administered}</span>
                      </td>
                      <td class="align-middle">
                        <span>${date_of_admission}</span>
                      </td>
                      <td class="align-middle">
                        <span>${date_of_release}</span>
                      </td>
                      <td class="align-middle">
                        <span>${allergies_recorded}</span>
                      </td>
                      <td class="align-middle">
                        <span>$${price}</span>
                      </td>
                      <td class="align-middle">
                        <a href="#!" onclick="deleteCar(${id})" data-mdb-toggle="tooltip" title="Remove"
                          ><i class="fa fa-trash fa-lg text-danger"></i
                        ></a>
                      </td>
                    </tr>`;
}

function updateRecords(retrievedRecords) {
  const carRecordsView = document.querySelector('#HosBlock-records');
  carRecordsView.innerHTML = retrievedRecords;
}

async function removeRecord(id) {
  const res = await deleteRecord(id);
  window.location.reload();
}
